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
 *              - email
 *              - password
 *          example:
 *              email: admin
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
 *              description: show all users in db
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      security:
 *              - bearerAuth: []
 */

/**
 * @swagger
 * /api/registration:
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
 *              description: logining and res token
 */

/**
 * @swagger
 * /api/me:
 *  get:
 *      summary: user data
 *      tags: [Authorization]
 *      responses:
 *          200:
 *              description: user data
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      security:
 *              - bearerAuth: []
 */

/**
 * @swagger
 * /api/logout:
 *  get:
 *      summary: test
 *      tags: [Authorization]
 *      responses:
 *          200:
 *              description: in creating
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      security:
 *              - bearerAuth: []
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
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: file
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
 *              description: insert to db your adds with file or empty filed
 */

/**
 * @swagger
 * /api/updateAds:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: add new ads
 *      tags: [Ads]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          username:
 *                              type: string
 *                          description:
 *                              type: string
 *                          file:
 *                              type: file
 *                              format: binary
 *                      required:
 *                          - id
 *                          - username
 *      responses:
 *          200:
 *              description: edit ads of id and username
 */

/**
 * @swagger
 * /api/deleteAds:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: add new ads
 *      tags: [Ads]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          id:
 *                              type: integer
 *                          username:
 *                              type: string
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          file:
 *                              type: file
 *                              format: binary
 *                      required:
 *                          - id
 *                          - username
 *      responses:
 *          200:
 *              description: delete ads by change from db field deleted
 */