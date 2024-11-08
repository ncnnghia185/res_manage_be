const { client } = require("../../../config/dbConfig");

// INSERT INTO PAYMENT
const insertPayment = async (data) => {
  await client.query(`BEGIN`);
  const result = await client.query(
    `
		INSERT INTO payment(order_id, payment_date, payment_method_vi, payment_method_en, payment_amount, payment_status_vi, payment_status_en, notes)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
		`,
    [
      data.order_id,
      data.payment_date,
      data.payment_method_vi,
      data.payment_method_en,
      data.payment_amount,
      data.payment_status_vi,
      data.payment_status_en,
      data.notes || null,
    ]
  );
  await client.query(
    `UPDATE orders SET status_en = $1, status_vi = $2, payment_en = $3, payment_vi = $4`,
    [
      result.rows[0].payment_status_en,
      result.rows[0].payment_status_vi,
      result.rows[0].payment_method_en,
      result.rows[0].payment_method_vi,
    ]
  );
  await client.query(
    `UPDATE tables SET status = 'available', status_vi = 'Đang trống'`
  );
  await client.query(`COMMIT`);
  return result.rows[0];
};
// SELECT ALL PAYMENTS
const selectAllPayments = async () => {
  const result = await client.query(`SELECT * FROM payment ORDER BY id DESC`);
  return result.rows;
};
// SELECT ONE PAYMENT
const selectOnePayment = async (id) => {
  const condition = parseInt(id);
  const result = await client.query(`SELECT * FROM payment WHERE id = $1`, [
    condition,
  ]);
  return result.rows[0];
};
module.exports = {
  insertPayment,
  selectAllPayments,
  selectOnePayment,
};
