/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

// 返回 x 的绝对值。
function Abs(value) {
  return Math.abs(value);
}
// 对数进行上舍入。
function Ceil(value) {
  return Math.ceil(value);
}
// 对 x 进行下舍入。
function Floor(value) {
  return Math.floor(value);
}
// 返回字符串的长度
function Len(value) {
  return value.length;
}
// 若所查询的字符串存在于其它字符串中，则返回真；否则返回假。
function Contains(str, substr) {
  return str.indexOf(substr) !== -1;
}
// 若字符串以所查字符串开始，则返回真，否则返回假。
function Startswith(str, substr) {
  return str.indexOf(substr) !== -1;
}
// 若字符串以所查字符串结束，则返回真，否则返回假。
function Endswith(str, substr) {
  return str.slice(-substr.length) === substr;
}
// 将字符串中所有字母转换为小写。
function Lower(str) {
  return str.toLowerCase();
}
// 将字符串中所有字母转换为大写。
function Upper(str) {
  return str.toUpperCase();
}
// 返回去掉首尾空格后的字符串。
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 将任意类型参数转换为字符串类型。
function Tostring(value) {
  return String(value);
}
// 将数字字符串转换为数字。
function Tonumber(value) {
  return parseFloat(value);
}
// 用相应替代字符串来替换输入字符串中出现的查询字符串。
function Replace(str, matchstr, replacestr) {
  return str.replace(matchstr, replacestr);
}
// 返回当前日期值。
function Today() {
  return dayjs().format("YYYY-MM-DD");
}
// 返回当前时间日期值。
function Now() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
}
// 数字转中文大写金额
function ToChineseDecimal(value) {
  let num = String(value);
  let strOutput = "";
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
  num += "00";
  const intPos = num.indexOf('.');
  if (intPos >= 0)
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (let i = 0; i < num.length; i += 1)
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
  return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
}

function typeMatch(value, field) {
  const valueType = typeof value;
  if (['Fields::MultipleSelectField', 'Fields::ProvinceCityAreaField'].indexOf(field.type) !== -1 && !Array.isArray(value)) {
    return "期望返回数组类型";
  }
  if (['Fields::IntegerField','Fields::PercentField','Fields::SumField','Fields::DecimalField'].indexOf(field.type) !== -1 && String(value) !== String(parseFloat(value))) {
    return "期望返回数字类型";
  }
  if (['Fields::DatetimeField', 'Fields::DateField'].indexOf(field.type) !== -1 && dayjs(value).format("L") === 'Invalid date') {
    return "期望返回日期类型";
  }
  if (field.type === 'Fields::BooleanField' && value !== true && value !== false) {
    return "期望返回布尔类型 true/false";
  }
  if (valueType === 'undefined' || valueType === 'object') {
    return `当前返回${valueType}类型，请检查`
  }
  if (String(value) === "NaN") {
    return `当前返回NaN，请检查`
  }

  return null;
}

function execFunction(code, object) {
  try {
    return eval(code);
  } catch (error) {
    console.log(error);
    return null;
  }
}

function checkFunction(code, object, field) {
  try {
    const result = execFunction(code, object);
    console.log(result);
    const matchMessage = typeMatch(result, field);
    
    if (matchMessage) {
      return { status: 'failed', message: `返回数据类型错误，${matchMessage}` }
    } 

    return { status: 'success' }
  } catch (error) {
    return { status: 'failed', message: error.message }
  }
}

// 阶乘
function factorial(n){
  if(n <= 1) return 1;
  return n * factorial(n - 1);
}

function formatValue (value, field) {
  let result = value;
  if (field.type === 'Fields::DecimalField') {
    // eslint-disable-next-line no-restricted-properties
    const precision = Math.pow(10, field.options.decimal_places || 2);
    if (field.options.round_option === "round_up") {
      result = Math.ceil((result || 0) * precision) / precision;
    } else if (field.options.round_option === "round_down") {
      result = Math.floor((result || 0) * precision) / precision;
    } else {
      result = Math.round((result || 0) * precision) / precision;
    }
  }

  return result;
}

export function calcFormulaValue(base_fields, formula_fields) {
  const object = base_fields;
  const formulaResult = {};
  let balanceFields = Object.keys(formula_fields);
  const totalCount = factorial(balanceFields.length);
  let calcCount = 0 // 防止异常无限循环
  while (balanceFields.length > 0 && calcCount < totalCount) {
    calcCount += 1;
    const tempFields = [];
    balanceFields.forEach(key => {
      const [mainFieldName, subFieldName] = key.split('.');
      const keys = formula_fields[key].reference_fields;
      const { field } = formula_fields[key];
      try {
        const currentDataKeys = Object.keys(object);
        if (subFieldName) {
          Object.keys(object[mainFieldName]).forEach(i => currentDataKeys.push(`${mainFieldName}.${i}`))
        }
        if (keys.length === 0 || keys.filter(i => currentDataKeys.indexOf(i) !== -1).length === keys.length) {
          if (subFieldName) {
            object[mainFieldName][subFieldName] = formatValue(eval(formula_fields[key].formula), field);
            formulaResult[subFieldName] = object[mainFieldName][subFieldName]
          } else {
            object[key] = formatValue(eval(formula_fields[key].formula), field);
            formulaResult[key] = object[key];
          }
          tempFields.push(key);
        }
      } catch (error) {
        console.log(key, error);
        if (subFieldName) {
          object[mainFieldName][subFieldName] = null;
          formulaResult[key] = null;
        } else {
          object[key] = null;
          formulaResult[key] = null;
        }
        tempFields.push(key);
      }
    })

    balanceFields = balanceFields.filter(i => tempFields.indexOf(i) === -1);
  }

  return formulaResult;
}

export {
  execFunction,
  checkFunction,
}