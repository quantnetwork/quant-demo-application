class DefaultController {
  /**
   * Health check
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async status(req, res, next) {
    res.object = {
      status: 'UP',
      components: {
        statusType: {
          details: {
            type: 'custom-js',
          },
        },
      },
    };

    return next();
  }
}

export default DefaultController;
