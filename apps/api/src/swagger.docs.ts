/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a worker or organisation account
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Clear session cookie
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     security: [{ cookieAuth: [] }]
 *     summary: Get current user
 * /api/v1/receipts:
 *   get:
 *     tags: [Receipts]
 *     security: [{ cookieAuth: [] }]
 *     summary: List worker receipts
 *   post:
 *     tags: [Receipts]
 *     security: [{ cookieAuth: [] }]
 *     summary: Create draft receipt
 * /api/v1/verification/{token}:
 *   get:
 *     tags: [Verification]
 *     summary: View receipt pending customer verification
 * /api/v1/public/receipts/{verificationCode}:
 *   get:
 *     tags: [Public]
 *     summary: Public proof page data
 * /api/v1/dashboard/worker:
 *   get:
 *     tags: [Dashboard]
 *     security: [{ cookieAuth: [] }]
 *     summary: Worker dashboard metrics
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     security: [{ cookieAuth: [] }]
 *     summary: List users (admin only)
 */

export {};
