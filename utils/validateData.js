const Joi = require("joi");

const validateData = (schema, data) => {
  const validation = schema.validate(data);
  const { value, error } = validation;
  if (error)
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  return value;
};

// Validate Menu Data
const validateMenu = (data) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().optional().allow(""),
    image: Joi.string(),
    category_id: Joi.number().required(),
    original_price: Joi.string(),
    restaurant_id: Joi.number().required(),
    owner_id: Joi.number().required(),
  });
  return validateData(schema, data);
};

// Validate tables data
const tableEnTypes = ["regular", "vip"];
const tableViTypes = ["Bàn thường", "Bàn VIP"];
const tableStatus = ["available", "serving", "reserved"];
const tableViStatus = ["Đang trống", "Đang có khách", "Đã được đặt trước"];
const validateTables = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().max(50),
    type: Joi.string().required(),
    capacity: Joi.string().required(),
    status: Joi.string()
      .valid(...tableStatus)
      .default("available"),
    location_id: Joi.number().required(),
    restaurant_id: Joi.number().required(),
    owner_id: Joi.number().required(),
  });
  return validateData(schema, data);
};

// Validate location data
const validateLocation = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    restaurant_id: Joi.number(),
    owner_id: Joi.number(),
  });
  return validateData(schema, data);
};

// Validate order_details data
// const validateOrderDetails = (data) => {
//   const schema = Joi.object().keys({
//     table_id: Joi.number().required(),
//     order_id: Joi.number(),
//     item_id: Joi.number(),
//     item_name: Joi.string().required(),
//     item_quantity: Joi.string().required(),
//     item_price: Joi.number(),
//     total_item_price: Joi.number(),
//   });
//   return validateData(schema, data);
// };

// Validate orders data
const validateOrder = (data) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    table_id: Joi.number().required(),
    order_time: Joi.string().required(),
    customer_name: Joi.string().required(),
    number_of_customer: Joi.number().required(),
    notes: Joi.string().optional().allow(""),
    order_status: Joi.string(),
    owner_id: Joi.number(),
    restaurant_id: Joi.number(),
  });
  return validateData(schema, data);
};

// Validate category data
const validateCategory = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    owner_id: Joi.number().required(),
    restaurant_id: Joi.number().required(),
  });
  return validateData(schema, data);
};

// Validate restaurant owner data
const validateRestaurantOwner = (data) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    fullname: Joi.string().required(),
    password: Joi.string().required().min(8),
    phone: Joi.string().required(),
  });
  return validateData(schema, data);
};

// Validate restaurant infor
const validateRestaurantInfor = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone_number: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string(),
    owner_id: Joi.number(),
  });
  return validateData(schema, data);
};

// Validate purchase data

const validatePurchase = (data) => {
  const schema = Joi.object().keys({
    date: Joi.string().required(),
    restaurant_id: Joi.number(),
    ingredient_name: Joi.string().required(),
    quantity: Joi.number().required(),
    unit: Joi.string().required(),
    unit_price: Joi.number().required(),
    note: Joi.string(),
  });
  return validateData(schema, data);
};

// Validate monthly expenses data
const expenses_type_vi = ["Chi phí cố định", "Phát sinh ngoài ý muốn"];
const expenses_type_en = ["fixed", "unexpected"];
const validateMonthlyExpenses = (data) => {
  const schema = Joi.object().keys({
    expense_date: Joi.string().required(),
    expense_type: Joi.string().required(),
    expenses_type_vi: Joi.string().valid(...expenses_type_vi),
    expenses_type_en: Joi.string().valid(...expenses_type_en),
    amount: Joi.number().required(),
    description: Joi.string(),
    restaurant_id: Joi.number().required(),
  });
  return validateData(schema, data);
};

// Validate staff data
const validateStaff = (data) => {
  const schema = Joi.object().keys({
    fullname: Joi.string().required(),
    gender: Joi.string().required(),
    date_of_birth: Joi.string().required(),
    phonenumber: Joi.string().required(),
    address: Joi.string(),
    identification_card: Joi.string(),
    hire_date: Joi.string().required(),
    restaurant_id: Joi.number().required(),
    net_salary: Joi.number().required(),
    status_work: Joi.string(),
  });
  return validateData(schema, data);
};

// Validate staff payroll and timesheet data
const validateStaffPayrollAndTimeSheet = (data) => {
  const schema = Joi.object().keys({
    total_salary: Joi.number(),
    daily_salary: Joi.number(),
    checkin: Joi.string().required(),
    checkout: Joi.string(),
    work_date: Joi.string().required(),
    work_hours: Joi.string(),
    bonus: Joi.number(),
    tax: Joi.number(),
    insurance: Joi.number(),
    other_deductions: Joi.number(),
    workdays: Joi.number(),
    notes: Joi.string(),
  });
  return validateData(schema, data);
};

// Validate ingredient for menu items
const validateIngredientOfMenuItem = (data) => {
  const schema = Joi.object().keys({
    ingredient_name: Joi.string(),
    quantity: Joi.number(),
    ingredient_unit: Joi.string(),
    cost_per_unit: Joi.number(),
  });
  return validateData(schema, data);
};
const ingredientSchema = Joi.object({
  ingredient_name: Joi.string(),
  quantity: Joi.number(),
  ingredient_unit: Joi.string(),
  cost_per_unit: Joi.number(),
});

// validate shift fund
const validateShiftFund = (data) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    shift_date: Joi.string().required(),
    open_time: Joi.string().required(),
    open_cash: Joi.string().required(),
    notes: Joi.string().optional().allow(""),
    owner_id: Joi.number().required(),
    restaurant_id: Joi.number().required(),
  });
  return validateData(schema, data);
};
module.exports = {
  validateMenu,
  validateTables,
  validateLocation,
  // validateOrderDetails,
  validateOrder,
  validateCategory,
  validateRestaurantOwner,
  validateRestaurantInfor,
  validatePurchase,
  validateMonthlyExpenses,
  validateStaff,
  validateStaffPayrollAndTimeSheet,
  validateIngredientOfMenuItem,
  validateShiftFund,
};
