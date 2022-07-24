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

// ads
/**
 * @swagger
 * components:
 *  schemas:
 *      Ads:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: the username
 *              description:
 *                  type: string
 *                  description: the description
 *              file:
 *                  type: string
 *                  description: thie file description
 *          required:
 *              - username
 *              - description
 *              - file
 *          example:
 *              username: admin
 *              description: your big description
 *              file: your big file
 */

/**
 * @swagger
 * /api/showAds:
 *  get:
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
 *      summary: show all ads
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
 *              description: show all ads from db if not have deleted:1
 */
