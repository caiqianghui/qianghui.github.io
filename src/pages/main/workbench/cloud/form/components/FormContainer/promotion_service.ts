function isPerMeet(promotion) {
  let flag = false;
  if (promotion.category === 'product' && promotion.promotion_rule === 'buy_and_give' && !promotion.ladder_promotion) {
    flag = true;
  } else if (promotion.category === 'combined') {
    if (promotion.promotion_rule === 'buy_and_give' || (promotion.promotion_type === 'amount' && promotion.promotion_rule === 'direct_reduction')) {
      flag = true;
    }
  }
 
  return flag;
}

function getExecutionValue(promotion, currentValue, originalPrice = null) {
  let executionValue: any = originalPrice;
  if (promotion.promotion_rule === 'direct_reduction') {
    promotion.promotion_conditions.forEach((promotion_condition) => {
      const meetValue = parseFloat(promotion_condition.meet_value)
      if (meetValue <= currentValue) {
        if (promotion.promotion_type === 'quantity') {
          executionValue = promotion_condition.execution_value;
        } else if (promotion.promotion_type === 'amount') {
          executionValue = parseFloat(promotion_condition.execution_value) * (isPerMeet(promotion) ? parseInt(currentValue / meetValue + '', 10) : 1);
        }
      }
    });
  } else if (promotion.promotion_rule === 'discount') {
    promotion.promotion_conditions.forEach((promotion_condition) => {
      if (parseFloat(promotion_condition.meet_value) <= currentValue) {
        if (promotion.category === 'product') {
          executionValue = parseFloat(originalPrice ||'') * (parseFloat(promotion_condition.execution_value) / 100);
          executionValue = Math.round(executionValue * 100) / 100;
        } else if (promotion.promotion_type === 'quantity') {
          executionValue = parseFloat(promotion_condition.execution_value) / 100;
        } else if (promotion.promotion_type === 'amount') {
          executionValue = 1 - parseFloat(promotion_condition.execution_value) / 100;
        }
      }
    });
  }

  return executionValue;
}

function setBuyAndGive(promotion, currentValue, refForm, allValues) {
  let isMeet = false;
  promotion.promotion_conditions.forEach((promotion_condition) => {
    const meetValue = parseFloat(promotion_condition.meet_value);
    if (meetValue <= currentValue) {
      const giveProducts = promotion_condition.give_products.map((give_product_id, i) => {
        let quantity = 0;
        if (promotion.category === 'product') {
          const executionTimes = isPerMeet(promotion) ? parseInt(currentValue / meetValue + '', 10) : 1
          quantity = i === 0 ? parseFloat(promotion_condition.execution_value) * executionTimes : 0;
        } else if (promotion.promotion_type === 'quantity' || promotion.promotion_type === 'amount') {
          quantity = i === 0 ? parseFloat(promotion_condition.execution_value) * (isPerMeet(promotion) ? parseInt(currentValue / meetValue + '', 10) : 1) : 0;
        }
        return {
          parent_source_id: promotion.id,
          product_id: give_product_id,
          quantity
        };
      });
      refForm.setFieldsValue({
        sales_order_giveaways: [
          ...(allValues.sales_order_giveaways || []).filter((item) => item.parent_source_id !== promotion.id),
          ...giveProducts,
        ],
      });
      isMeet = true;
    }
  });
  if (!isMeet) {
    refForm.setFieldsValue({
      sales_order_giveaways: (allValues.sales_order_giveaways || []).filter((item) => item.parent_source_id !== promotion.id),
    });
  }
}

function setDiscountAmount(options) {
  const { executionValue, refForm, promotion, totalAmount, setForceUpdate } = options;

  const discountPromotions = refForm.getFieldValue('discount_promotions') || [];
  if (executionValue) {
    const currentDiscountPromotion = {
      promotion_id: promotion.id,
      promotion,
      discount_amount: promotion.promotion_rule === 'direct_reduction' ? executionValue : Math.round(totalAmount * executionValue * 100) / 100
    };
    const newDiscountPromotions = [
      ...discountPromotions.filter((item) => item.promotion_id !== promotion.id),
      currentDiscountPromotion,
    ];
    let discountAmount = 0;
    newDiscountPromotions.forEach((item) => {
      discountAmount += parseFloat(item.discount_amount);
    });
    refForm.setFieldsValue({
      discount_promotions: newDiscountPromotions,
      discount_amount: discountAmount,
    });
  } else {
    const newDiscountPromotions = discountPromotions.filter((item) => item.promotion_id !== promotion.id);
    let discountAmount = 0;
    newDiscountPromotions.forEach((item) => {
      discountAmount += parseFloat(item.discount_amount);
    });
    refForm.setFieldsValue({
      discount_promotions: newDiscountPromotions,
      discount_amount: discountAmount,
    });
  }

  setForceUpdate((i) => i + 1);
}

function productPromotionDeal(options, promotion) {
  const { refForm, productsRef, rowIndex, value, allValues } = options;
  if (promotion.promotion_rule !== 'buy_and_give') {
    const selectProduct = productsRef.current[promotion.product_id];
    const originalPrice = selectProduct.current_client_price || 0;
    const executionValue = getExecutionValue(promotion, value, originalPrice);

    refForm.setFields([
      {
        name: ['sales_order_items', rowIndex, 'price'],
        value: executionValue,
      },
    ]);
  } else {
    setBuyAndGive(promotion, value, refForm, allValues);
  }
}

function combinedPromotionDeal(options, promotion) {
  const { refForm, productsRef, promotionsRef, allValues, setForceUpdate } = options;

  const selectProduct = productsRef.current[promotion.product_id] || {};
  const originalPrice = selectProduct.current_client_price || 0;
  if (promotion.promotion_type === 'quantity') {
    let totalQuantity = 0;
    const promotionItems = (allValues.sales_order_items || []).filter((item) => promotionsRef.current[item.product_id] && promotionsRef.current[item.product_id].id === promotion.id);
    promotionItems.forEach((sales_order_item) => {
      totalQuantity += parseFloat(sales_order_item.quantity || 0);
    });
    if (promotion.promotion_rule !== 'buy_and_give') {
      const executionValue = getExecutionValue(promotion, totalQuantity);
      (allValues.sales_order_items || []).forEach((item, index) => {
        if (promotionsRef.current[item.product_id] && promotionsRef.current[item.product_id].id === promotion.id) {
          let value = originalPrice;
          if (executionValue) {
            value = promotion.promotion_rule === 'discount' ? (Math.round(originalPrice * executionValue * 100) / 100) : executionValue;
          }
          refForm.setFields([
            {
              name: ['sales_order_items', index, 'price'],
              value
            },
          ]);
        }
      });
    } else {
      setBuyAndGive(promotion, totalQuantity, refForm, allValues);
    }
  } else if (promotion.promotion_type === 'amount') {
    let totalAmount = 0;
    const promotionItems = (allValues.sales_order_items || []).filter((item) => item && promotionsRef.current[item.product_id] && promotionsRef.current[item.product_id].id === promotion.id);
    promotionItems.forEach((sales_order_item) => {
      totalAmount += parseFloat(sales_order_item.price || 0) * parseFloat(sales_order_item.quantity || 0);
    });
    if (promotion.promotion_rule !== 'buy_and_give') {
      const executionValue = getExecutionValue(promotion, totalAmount);
      setDiscountAmount({ executionValue, refForm, promotion, totalAmount, setForceUpdate });
    } else {
      setBuyAndGive(promotion, totalAmount, refForm, allValues);
    }
  }
};

const wholeOrderPromotionDeal = (options, promotion) => {
  const { refForm, allValues, setForceUpdate } = options;
  let totalAmount = 0;
  (allValues.sales_order_items || []).forEach((sales_order_item) => {
    if (sales_order_item) {
      totalAmount += parseFloat(sales_order_item.price || 0) * parseFloat(sales_order_item.quantity || 0);
    }
  });
  if (promotion.promotion_rule !== 'buy_and_give') {
    const executionValue = getExecutionValue(promotion, totalAmount);
    setDiscountAmount({ executionValue, refForm, promotion, totalAmount, setForceUpdate });
  } else {
    setBuyAndGive(promotion, totalAmount, refForm, allValues);
  }
};

export function excutePromotionRule(options, changedValues, allValues) {
  const { refForm, fields, promotionsRef, orderPromotionRef } = options;
  const changeField = fields.filter(item => item.name === Object.keys(changedValues)[0])[0];
  const changeValue: any = Object.values(changedValues)[0];
  if (changeValue[0]) {
    if (changeField && changeField.type === "Fields::NestedFormField") {
      let rowIndex;
      let rowData;
      let changeSubField;
      if (changeValue.length === 1) {
        rowIndex = 0;
        [rowData] = changeValue;
        [changeSubField] = changeField.fields.filter(item => item.name === Object.keys(rowData)[0]);
      } else if (changeValue.filter(item => item !== undefined).length === 1) {
        rowIndex = changeValue.length - 1;
        rowData = changeValue[rowIndex] || {};
        [changeSubField] = changeField.fields.filter(field => field.name === Object.keys(rowData)[0]);
      }
  
      if (changeField.name === 'sales_order_items' && changeSubField && (changeSubField.name === 'quantity' || changeSubField.name === 'price')) {
        const currentProductId = refForm.getFieldValue(['sales_order_items', rowIndex, 'product_id']);
        const currentPromotion = promotionsRef.current[currentProductId];
        if (currentPromotion) {
          if (currentPromotion.category === 'product') {
            productPromotionDeal({...options, rowIndex, value: rowData.quantity, allValues}, currentPromotion);
          } else if (currentPromotion.category === 'combined') {
            combinedPromotionDeal({...options, rowIndex, value: rowData.quantity, allValues}, currentPromotion);
          }
        }
        const orderPromotion = orderPromotionRef.current;
        if (orderPromotion) {
          wholeOrderPromotionDeal({...options, allValues}, orderPromotion);
        }
      }
    }
  }
}
