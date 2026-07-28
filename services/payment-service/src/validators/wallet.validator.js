const Joi = require('joi');
const { id, money } = require('@movie/common').schemas;

const TRANSACTION_TYPES = ['TOPUP', 'CHARGE', 'REFUND'];

const topupWalletSchema = Joi.object({
    targetUserId: id.required(),
    amount: money.min(1).max(100000).required().messages({
        'any.required': 'amount is required',
    }),
});

const chargeWalletSchema = Joi.object({
    userId: userId.required(),
    amount: money.required(),
    bookingId: id.required(),
    description: fields.description.optional(),

});

const refundWalletSchema = Joi.object({
    userId: id.required(),
    amount: money.required(),
    bookingId: id.optional(),
    transactionId: id.optional(),
})
  .or('bookingId', 'transactionId')
  .messages({
    'object.missing': 'Either bookingId or transactionId must be provided for a refund',
  });


module.exports = { topupWalletSchema, chargeWalletSchema, refundWalletSchema, TRANSACTION_TYPES };