// Auth
/**
 * @swagger
 * components:
 *  schemas:
 *      Authorization:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: the username
 *              password:
 *                  type: string
 *                  description: the password
 *          required:
 *              - username
 *              - password
 *          example:
 *              username: admin
 *              password: admin
 */

/**
 * @swagger
 * /api/showUsers:
 *  get:
 *      summary: show all ads
 *      tags: [Authorization]
 *      responses:
 *          200:
 *              description: show all ads from db if not have deleted:1
 */

/**
 * @swagger
 * /api/reg:
 *  post:
 *      summary: create new user
 *      tags: [Authorization]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Authorization'
 *      responses:
 *          200:
 *              description: new user created
 */

/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: Login and responsed your token
 *      tags: [Authorization]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Authorization'
 *      responses:
 *          200:
 *              description: take your token
 */

// Ads
/**
 * @swagger
 * components:
 *  schemas:
 *      Ads:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: enter username
 *              description:
 *                  type: string
 *                  description: your big text
 *              file:
 *                  type: string
 *                  format: binary
 *                  description: upload a file
 *          required:
 *              - username
 *              - description
 *              - file
 *          example:
 *              username: admin
 *              description: your big description
 *              file: your big file
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  security:
 *      - bearerAuth: []
 */

/**
 * @swagger
 * /api/showAds:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: show all ads
 *      tags: [Ads]
 *      responses:
 *          200:
 *              description: show all ads from db if not have deleted:1
 */

/**
 * @swagger
 * /api/addAds:
 *  post:
 *      security:
 *           - bearerAuth: []
 *      summary: add new ads
 *      tags: [Ads]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Ads'
 *      responses:
 *          200:
 *              description: show all ads from db if not have deleted:1
 */

/**
 * @swagger
 * /api/editAds:
 *  post:
 *      security:
 *           - bearerAuth: []
 *      summary: edit ads
 *      tags: [Ads]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Ads'
 *      responses:
 *          200:
 *              description: change ads in db
 */

/**
 * @swagger
 * /api/deleteAds:
 *  post:
 *      security:
 *           - bearerAuth: []
 *      summary: deleted ads
 *      tags: [Ads]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Ads'
 *      responses:
 *          200:
 *              description: change in db "deleted" to 1
 */