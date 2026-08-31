const { AuditLog } = require('../../models');

const logAudit = async (userId, action) => {
  try {
    await AuditLog.create({ userId, action });
  } catch (err) {
    console.error(`Failed to write audit log (${action}) for user ${userId}:`, err.message);
  }
};

module.exports = { logAudit };