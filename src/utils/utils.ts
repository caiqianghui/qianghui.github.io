import Taro from "@tarojs/taro";
import { message } from "antd";
import dayjs from "dayjs";
import http from "./http/http";

export function getRules(field) {
  const rules: any = [];
  if (field.validations.presence) {
    const fieldTypes = ['Fields::TextField', 'Fields::TextAreaField', 'Fields::PercentField', 'Fields::IntegerField', 'Fields::DecimalField']
    if (fieldTypes.find((type) => type === field.type)) {
      rules.push({ required: true,message: '请输入' + field.label});
    } else {
      rules.push({ required: true, message: field.label + '为空'});
    }
  }
  if (field.validations.length && field.validations.length.maximum !== 0) {
    rules.push({ max: field.validations.length.maximum });
  }
  if (field.validations.numericality) {
    const rule: any = {};
    let min = 0;
    let max = 0;
    if (field.validations.numericality.lower_bound_check === "greater_than") {
      min = field.validations.numericality.lower_bound_value + 1;
      rule.min = min;
    } else if (field.validations.numericality.lower_bound_check === "greater_than_or_equal_to") {
      min = field.validations.numericality.lower_bound_value;
      rule.min = min;
    }
    if (field.validations.numericality.upper_bound_check === "less_than") {
      max = field.validations.numericality.upper_bound_value - 1;
      rule.max = max;
    } else if (field.validations.numericality.upper_bound_check === "less_than_or_equal_to") {
      max = field.validations.numericality.upper_bound_value;
      rule.max = max;
    }
    rule.message = field.label + '须在' + min + '-' + max + '之间'

    if (Object.keys(rule).length > 0) {
      rules.push({...rule, type: "number"});
    }
  }

  if (field.type === 'Fields::EmailField') {
    rules.push({ type: 'email',  message: field.label + '不是一个有效的email'});
  }
  if (field.type === 'Fields::LinkField') {
    rules.push({ type: 'url', message: field.label + '不是一个有效的url' });
  }
  return rules;
}

export function calcFieldValue(formula, fields, data, sub_label?, data_item?) {
  let newFormula = formula;
  console.log('fields', fields.label);
  fields.forEach((field) => {
    if (sub_label && data_item) {
      newFormula = newFormula.replace(
        `/[${sub_label}.${field.label}]/g`,
        (data_item[field.name] && data_item[field.name]._isAdayjsObject) ? dayjs(data_item[field.name]).format('YYYY-MM-DD') : data_item[field.name] || 0,
      );
    } else if (data[field.name] && data[field.name]._isAdayjsObject) {
      newFormula = newFormula.replace(`/[${field.label}]/g`, dayjs(data[field.name]).format('YYYY-MM-DD'));
    } else {
      newFormula = newFormula.replace(`/[${field.label}]/g`, data[field.name] || (field.type === "Fields::TextField" ? "" : 0));
    }
  });
  try {
    const result = eval(newFormula);
    console.log(newFormula, result);
    return typeof result === 'number' ? Math.round(result * 100) / 100 : result;
  } catch (error) {
    console.log(newFormula, error);
    return null;
  }
}

export function refreshCloudToken(params: {grant_type: string, refresh_token: string}) {
  return new Promise(async (resolve, _reject) => {
    const expiresIn =  Taro.getStorageSync('expires_in');
    const accessToken =  Taro.getStorageSync('access_token');
    console.log('accessToken', accessToken);
    if (accessToken && params.grant_type === 'refresh_token' && (!expiresIn || dayjs.unix(Number(expiresIn)).diff(dayjs(), 'minute') > 1)) {
      resolve({access_token: accessToken});
    } else {
      http.post(`/oauth/token`, params, {headers: {Accept: 'application/json'}}).then((res) => {
        // console.log('刷新token', res);
        const data = res.data;
        if (data.refresh_token) {
          Taro.setStorage({key: 'refresh_token', data: data.refresh_token});
          Taro.setStorage({key: 'access_token', data: data.access_token});
          Taro.setStorage({key: 'expires_in', data: data.created_at + data.expires_in});
        }
        resolve(data);
      }).catch((err) => {
        Taro.hideLoading();
        if (err.toString().indexOf('Request failed with status code 400')) {
          message.error('token 过期, 请退出重新进入Zoho CRM');
        }
      })
    }
  });
}

export async function getCloudToken() {
  // const tokenId = Taro.getStorageSync('tokenId');
  const expiresIn = Taro.getStorageSync('expires_in');
  const accessToken = Taro.getStorageSync('access_token');
  const refresh_token = Taro.getStorageSync('refresh_token');
  if (accessToken && (!expiresIn || dayjs.unix(Number(expiresIn)).diff(dayjs(), 'minute') > 1)) {
    return `Bearer ${accessToken}`;
  }
  if (refresh_token && refresh_token !== 'undefined') {
    const token = await refreshCloudToken({ grant_type: 'refresh_token', refresh_token: refresh_token }).then((res: any) => {
      return res ? `Bearer ${res.access_token}` : null
    })

    return token;
  }
  return null
}

export function refreshZOHOToken() {
  return new Promise(async (resolve, reject) => {
    const token = await getCloudToken();
    if (token) {
      http.post('/api/v1/functions/current_user_zoho_access_token/execute', {}, {headers: {Authorization: token}}).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data.result;
          Taro.setStorage({key: 'zoho_access_token', data: data.zoho_access_token});
          Taro.setStorage({key: 'expiration_time', data: data.expiration_time});
          resolve(data);
        } else {
          reject();
        }
      }).catch((_err) => {
        message.error('网络错误');
        Taro.hideLoading();
        reject();
      });
    }
  });
}

export async function getZOHOtoken() {
  const zoho_access_token = Taro.getStorageSync('zoho_access_token');
  const expiration_time = Taro.getStorageSync('expiration_time');
  console.log('zoho_access_token', zoho_access_token);
  if (!expiration_time || expiration_time && dayjs(expiration_time || 0) < dayjs(new Date()) ) {
    // expiration_time 过期调用
    const token = await refreshZOHOToken().then((res: any) => {
      return res ? `${res.zoho_access_token}` : null
    }).catch(() => {
      return null;
    });
    return token;
  } else {
    return zoho_access_token ? `${zoho_access_token}` : null;
  }
}

export function isDate(value: string) {
  // 日期+时间的正则表达式
  const Reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  const regExp = new RegExp(Reg);
  if (!regExp.test(value)) {
    return false;
  }
  return true;
}

export function initSearchCondition(searchConditionItems) {
  const newSearchConditionItems: any = [];
  (searchConditionItems || []).forEach((item) => {
    const row: any = {};
    row.id = item.id;
    row.field_id = item.field_id;
    row.criteria_option = item.criteria_option;
    row.criteria_value = [...item.criteria_value];
    row.show_field_condition = item.show_field_condition;
    // eslint-disable-next-line no-underscore-dangle
    if (item.criteria_value[0] && isDate(item.criteria_value[0])) {
      row.criteria_value[0] = dayjs(item.criteria_value[0]);
    }
    // eslint-disable-next-line no-underscore-dangle
    if (item.criteria_value[1] && isDate(item.criteria_value[1])) {
      row.criteria_value[1] = dayjs(item.criteria_value[1]);
    }
    newSearchConditionItems.push(row);
  });

  return newSearchConditionItems;
}

export function getMeetStr(promotion) {
  let str = '满';
  if (!promotion.ladder_promotion) {
    if (promotion.category === 'product' && promotion.promotion_rule === 'buy_and_give') {
      str = '每满';
    } else if (promotion.category === 'combined') {
      if (
        promotion.promotion_rule === 'buy_and_give' ||
        (promotion.promotion_type === 'amount' && promotion.promotion_rule === 'direct_reduction')
      ) {
        str = '每满';
      }
    } else if (promotion.category === 'whole_order' && promotion.promotion_rule !== 'discount') {
      str = '每满';
    }
  }

  return str;
};

export function getMeetValueTip(promotion) {
  if (promotion.promotion_rule === 'buy_and_give') {
    return `${promotion.promotion_type === 'amount' ? '元' : ''}，赠送`;
  } 
  
  if (promotion.promotion_rule === 'direct_reduction') {
    return `${promotion.promotion_type === 'amount' ? '元' : ''}，${
      promotion.category !== 'product' && promotion.promotion_type === 'amount'
        ? '订单金额减'
        : '订货价统一降至'
    }`;
  } 
  
  if (promotion.promotion_rule === 'discount') {
    return `${promotion.promotion_type === 'amount' ? '元' : ''}，${
      promotion.category !== 'product' && promotion.promotion_type === 'amount'
        ? '订单金额打折'
        : '在原订货价基础上再打折'
    }`;
  }

  return null;
};

export function getExecutionValueTip(promotion) {
  if (promotion.promotion_rule === 'buy_and_give') {
    return '个';
  } 
  
  if (promotion.promotion_rule === 'direct_reduction') {
    return '元';
  } 
  
  if (promotion.promotion_rule === 'discount') {
    return '%';
  }

  return null;
};


function isMeetCondition(condition, allValues, fields) {
  const conditionField = fields.filter(item => item.id === condition.field_id)[0];
  if (!conditionField) {
    return false;
  }
  if (conditionField?.name) {
    const fieldValue = allValues[conditionField?.name];
    if (
      (["IS", "ON", "EQ"].indexOf(condition.criteria_option) !== -1 && fieldValue === condition.criteria_value[0]) ||
      (["ISNT", "NOT_EQ"].indexOf(condition.criteria_option) !== -1 && fieldValue !== condition.criteria_value[0]) ||
      (condition.criteria_option === "IN" && (condition.criteria_value[0] || []).indexOf(fieldValue) !== -1) ||
      (condition.criteria_option === "NOT_IN" && (condition.criteria_value[0] || []).indexOf(fieldValue) === -1) ||
      (condition.criteria_option === "CONTAINS" && String(fieldValue).indexOf(condition.criteria_value[0]) !== -1) ||
      (condition.criteria_option === "DOESNT_CONTAINS" && String(fieldValue).indexOf(condition.criteria_value[0]) === -1) ||
      (condition.criteria_option === "ARRAY_CONTAINS" && (fieldValue || []).indexOf(condition.criteria_value[0]) !== -1) ||
      (condition.criteria_option === "ARRAY_DOESNT_CONTAINS" && (fieldValue || []).indexOf(condition.criteria_value[0]) === -1) ||
      (condition.criteria_option === "STARTS_WITH" && String(fieldValue).startsWith(condition.criteria_value[0])) ||
      (condition.criteria_option === "ENDS_WITH" && String(fieldValue).endsWith(condition.criteria_value[0])) ||
      (condition.criteria_option === "IS_EMPTY" && ['', 'null', 'undefined'].indexOf(String(fieldValue)) !== -1) ||
      (condition.criteria_option === "IS_NOT_EMPTY" && ['', 'null', 'undefined'].indexOf(String(fieldValue)) === -1) ||
      (condition.criteria_option === "BETWEEN" && fieldValue >= condition.criteria_value[0] && fieldValue <= condition.criteria_value[1]) ||
      (condition.criteria_option === "NOT_BETWEEN" && fieldValue < condition.criteria_value[0] && fieldValue > condition.criteria_value[1]) ||
      (["BEFORE", "LT"].indexOf(condition.criteria_option) !== -1 && fieldValue < condition.criteria_value[0]) ||
      (condition.criteria_option === "LTEQ" && fieldValue <= condition.criteria_value[0]) ||
      (["AFTER", "GT"].indexOf(condition.criteria_option) !== -1 && fieldValue > condition.criteria_value[0]) ||
      (condition.criteria_option === "GTEQ" && fieldValue >= condition.criteria_value[0]) ||
      (condition.criteria_option === "SELECTED" && fieldValue === true) ||
      (condition.criteria_option === "NOT_SELECTED" && fieldValue === false)
    ) {
      return true
    }

  }
  return false
}

export function getLayoutRuleResult(layoutRule, allValues, sections) {
  let isMeet = false;
  const fields = sections.map((section) => section.fields).flat();
  const meets: any = [];
  layoutRule.conditions.forEach(condition => {
    meets.push(isMeetCondition(condition, allValues, fields));
  })
  if (layoutRule.patten === 'AND' || (!layoutRule.patten && !layoutRule.custom_patten)) {
    isMeet = true;
    meets.forEach(meet => {
      isMeet = isMeet && meet;
    })
  } else if (layoutRule.patten === 'OR') {
    meets.forEach(meet => {
      isMeet = isMeet || meet;
    })
  } else if (layoutRule.custom_patten) {
    let str = layoutRule.custom_patten;
    meets.forEach((meet, index) => {
      // str = str.replaceAll(`[${index + 1}]`, meet);
      str = str.replace(`[${index + 1}]`, meet);
    });
    console.log(str);
    str = str.replace(/OR/g, "||").replace(/AND/g, "&&");
    console.log('str=======>', str);
    try {
      isMeet = eval(str) === true;
    } catch (error) {
      console.log(layoutRule, error);
      isMeet = false;
    }
  }
  const newSections = [...sections];
  const clearValues = {};
  layoutRule.actions.forEach(action => {
    if (action.show_type === 'field') {
      newSections.forEach((section, i) => {
        section.fields.forEach((field, j) => {
          if (action.values.indexOf(field.id) !== -1) {
            newSections[i].fields[j].hidden = !isMeet
            if (!isMeet) {
              clearValues[newSections[i].fields[j].name] = null;
            }
          }
        })
      })
    } else if (action.show_type === 'section') {
      newSections.forEach((section, i) => {
        if (action.values.indexOf(section.id) !== -1) {
          newSections[i].hidden = !isMeet
          if (!isMeet) {
            clearValues[section.fields[0].name] = null;
          }
        }
      })
    } else if (action.show_type === 'presence_field') {
      newSections.forEach((section, i) => {
        section.fields.forEach((field, j) => {
          if (action.values.indexOf(field.id) !== -1) {
            newSections[i].fields[j].validations.presence = isMeet;
          }
        })
      })
    }
  })

  return [newSections, clearValues]
}

// 千分位分割 并保留两位小数点
export function thousandAbdDecimal (num: string | number) {
  const newNum = Number(num);
  let amount = 'CN￥';
  if (newNum) {
    amount += newNum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  } else {
    amount +=  '0.00';
  }

  return amount;
}


export function isMeetConditions(condition, condition_items, data, fields) {
  if (!condition) {
    return false
  }

  let isMeet = false;
  const meets: any = [];
  condition_items.forEach(condition_item => {
    meets.push(isMeetCondition(condition_item, data, fields));
  })
  if (condition.patten === 'AND' || (!condition.patten && !condition.custom_patten)) {
    isMeet = true;
    meets.forEach(meet => {
      isMeet = isMeet && meet;
    })
  } else if (condition.patten === 'OR') {
    meets.forEach(meet => {
      isMeet = isMeet || meet;
    })
  } else if (condition.custom_patten) {
    let str = condition.custom_patten;
    meets.forEach((meet, index) => {
      str = str.replaceAll(`[${index + 1}]`, meet);
    })
    str = str.replaceAll("OR", "||").replaceAll("AND", "&&");

    try {
      isMeet = eval(str) === true;
    } catch (error) {
      console.log(condition, error);
      isMeet = false;
    }
  }

  return isMeet;
}

// zoho 筛选拼接
export function getSelectQuery (module_name, screenLayout, children) {
  let _criteria = '';

  const street = screenLayout?.find((item) => item.active && item.api_name === 'Street');
  let streets = [];
  if (street) {
    street.value.forEach((val, ind) => {
      streets = streets.concat({
        ...street,
        api_name: ind === 0 ? 'Province' : ind === 1 ? 'City1' : 'Street',
        value: val,
      })
    });
  }

  const activeScreenLayout = screenLayout?.filter((item) => item.active && item.api_name !== 'Street').concat(streets);
  /**
   *  (
   * 
   * 1 (a = 'a')
   * ((a = 'a'))
   * 
   *  2 and ((b = 'b')
   *  ((a = 'a') and ((b = 'b')))
   * 
   *  3 and ((c = 'c')
   *  ((a = 'a') and ((b = 'b) and ((c = 'c'))))
   *   
   *  4 and ((d = 'd')
   *  ((a = 'a') and ((b = 'b) and ((c = 'c') and ((d = 'd')))))
   * 
   *  5 and ((e = 'e')
   *  ((a = 'a') and ((b = 'b) and ((c = 'c') and ((d = 'd') and ((e = 'e'))))))
   *  ((Phone = '223') and ((Phone = '111') and ((Phone = '123') and ((Phone = '123') and ((Phone = '123213'))))))
   *  
   *  1 ) 2 )) 3 ))) 4 ))))  5 )))))
   */
  activeScreenLayout?.forEach((item, index) => {
    if (activeScreenLayout.length === 1) {
      if (item.node.key === '=' || item.node.key === '!=') {
        _criteria += `((${item.api_name} ${item.node.key} '${item.value || ''}')`
      } else {
        if (item.node.key === 'like' || item.node.key === 'not lik') {
          _criteria += `(${item.api_name} ${item.node.key} '%${item.value || ''}%')`
        } else if (item.node.key === 'starts_with') {
          _criteria += `(${item.api_name} like '${item.value || ''}%')`
        } else if (item.node.key === 'ends_with') {
          _criteria += `(${item.api_name} like '%${item.value || ''}')`
        } else {
          _criteria += `(${item.api_name} ${item.node.key})`
        }
      }
    } else {
      if (index === activeScreenLayout.length - 1) {
        if (item.node.key === '=' || item.node.key === '!=') {
          _criteria += `((${item.api_name} ${item.node.key} '${item.value || ''}')`
        } else {
          if (item.node.key === 'like' || item.node.key === 'not lik') {
            _criteria += `((${item.api_name} ${item.node.key} '%${item.value || ''}%')`
          } else if (item.node.key === 'starts_with') {
            _criteria += `((${item.api_name} like '${item.value || ''}%')`
          } else if (item.node.key === 'ends_with') {
            _criteria += `((${item.api_name} like '%${item.value || ''}')`
          } else {
            _criteria += `((${item.api_name} ${item.node.key})`
          }
          _criteria += ') '
        }
      } else {
        if (item.node.key === '=' || item.node.key === '!=') {
          _criteria += `((${item.api_name} ${item.node.key} '${item.value || ''}')`
        } else {
          if (item.node.key === 'like' || item.node.key === 'not lik') {
            _criteria += `((${item.api_name} ${item.node.key} '%${item.value || ''}%')`
          } else if (item.node.key === 'starts_with') {
            _criteria += `((${item.api_name} like '${item.value || ''}%')`
          } else if (item.node.key === 'ends_with') {
            _criteria += `((${item.api_name} like '%${item.value || ''}')`
          } else {
            _criteria += `((${item.api_name} ${item.node.key})`
          }
        }
        _criteria += ` and `
      }
    }
  });

  let select_query = 'select ' + children.find((item) => item.moduleName === module_name)?.selects?.join(',');
  
  activeScreenLayout?.forEach(() => {
    _criteria += `)`;
  })

  select_query += ` from ${module_name} where ${_criteria}`;
  return select_query;
}

// zoho 模块展示
export function getModuleText(value: any, module: string) {
  const data = {
    name: '',
    description: '',
    phone: '',
    amount: 0,
    rating: '',
  }

  switch (module) {
    case 'Leads':
      data.name = value.Company;
      data.description = value.Full_Name;
      data.rating = value.Rating;
      data.phone = value.Phone;
      break;
    case 'Deals':
      data.name = value.Deal_Name;
      data.description = value.Stage;
      data.amount = value.Amount;
      data.rating = value.Rating;
      data.phone = value.phone;
      break;
    case 'Accounts':
      data.name = value.Account_Name;
      data.description = value.Department;
      data.phone = value.Phone;
      break;
    case 'Public_Leads':
      data.name = value.Name;
      data.description = value.Last_Name;
      data.phone = value.Phone;
      data.rating = value.Rating;
      break;
    case 'TelephoneDevelopment':
      data.name = value.company_name || '';
      data.description = value.Name || '';
      data.phone = value.Phone || value.phone || '';
      data.rating = value.Rating || '';
      break;
    case 'CompetitionInformationFeedback':
      data.name = value.Name || '';
      data.description = value.competition_model || '';
      data.rating = value.laser_brand || '';
      break;
    default:
      data.name = value.Name || '';
      data.description = value.Last_Name || '';
      data.phone = value.Phone || value.phone || '';
      data.rating = value.Rating || '';
      break;
  }
  return data;
}
