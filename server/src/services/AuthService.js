/* eslint-disable no-trailing-spaces */
import OverledgerSDK from '@quantnetwork/overledger-bundle';
import log4js from 'log4js';

import getConfig from '../../config';

const log = log4js.getLogger('AuthService');

class AuthService {
  /**
   * Returns an access token.
   */
  async getToken() {
    // If we don't have a refresh token yet, we need to make a call to get tokens.
    if (!this.refreshToken) {
      return this.getNewTokens();
    }

    // We have a refresh token, so let's try to fetch an access token using that.
    return this.overledger.refreshAccessToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET, this.refreshToken)
      .then(response => response.data.access_token)
      .catch((error) => {
        // Lets assume the refresh token expired, so make a call to get a new set of tokens.
        log.error(error);
        return this.getNewTokens();
      });
  }

  /**
   * Fetches tokens, and returns an access token.
   */
  async getNewTokens() {
    if (!this.overledger) {
      await this.startupSdk();
    }

    const refreshTokensResponse = await this.overledger.getTokensUsingClientIdAndSecret(
      process.env.USER_NAME,
      process.env.PASSWORD,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
    );

    // Keep tokens so we can use later (refresh token).
    this.refreshToken = refreshTokensResponse.refreshToken;
    this.idToken = refreshTokensResponse.idToken;
    this.accessToken = refreshTokensResponse.accessToken;
    return this.accessToken;
  }

  async startupSdk() {
    const config = await getConfig();
    this.overledger = new OverledgerSDK({
      dlts: [],
      userPoolID: config.userPoolId,
      provider: config.provider,
      envFilePassword: config.envFilePassword,
    });
  }
}

export default new AuthService();
