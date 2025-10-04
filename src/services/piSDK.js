class PiSDKService {
  constructor() {
    this.pi = window.Pi;
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.pi.init({ version: "2.0" });
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Pi SDK initialization failed:', error);
      return false;
    }
  }

  async authenticate() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const user = await this.pi.authenticate();
      return {
        success: true,
        user: {
          uid: user.uid,
          username: user.username,
          accessToken: user.accessToken
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createPayment(amount, memo, metadata = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const paymentData = {
      amount: amount,
      memo: memo,
      metadata: {
        productId: metadata.productId,
        orderId: metadata.orderId,
        ...metadata
      }
    };

    try {
      const payment = await this.pi.createPayment(paymentData);
      return {
        success: true,
        paymentId: payment.identifier
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async completePayment(paymentId, txid) {
    try {
      await this.pi.completePayment(paymentId, txid);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PiSDKService();
