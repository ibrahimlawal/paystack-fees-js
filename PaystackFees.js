try {
    require('@hapi/joi'); // eslint-disable-line global-require
} catch (error) {
    process.emitWarning('Please install peer dependency - @hapi/joi - so that validations can run.');
    throw error;
}
const Joi = require('@hapi/joi');

/**
 * A class for managing Paystack fees in your application.
 *
 * Installation
 * ============
 * **Peer Dependency (required)**
 *
 * Install Joi which we have employed for validating parameters sent to functions in this library
 * ```
 * npm install --save @hapi/joi
 * ```
 * Now install the module
 *```
 * npm install --save paystack-fees
 *```
 *
 *
 * Sample Usage
 * ============
 * ```javascript
 * const PaystackFees = require('paystack-fees');
 * // The lines below will create a new object that calculates fees based on the fee
 * // schedule for USD payments. The cap is set to an arbitrarily high number since there
 * // is no cap.
 * const paystackFees = (new PaystackFees())
 *             .withPercentage(0.035)
 *             .withAdditionalCharge(0)
 *             .withCap(1000000000000)
 *             .withThreshold(0);
 *
 * // you can now calculate fees for an amount by calling the `calculateFor` function
 * const feesFor1000USD = paystackFees.calculateFor(100000);
 * // or the amount to be sent when we intend to be settled a target amount
 * const amountToSendToBeSettled50USD = paystackFees.addTo(5000);
 * ```
 */
class PaystackFees {
    constructor() {
        this.percentage = PaystackFees.DEFAULT_LOCAL_NGN_PERCENTAGE;
        this.additionalCharge = PaystackFees.DEFAULT_LOCAL_NGN_ADDITIONAL_CHARGE;
        this.threshold = PaystackFees.DEFAULT_LOCAL_NGN_THRESHOLD;
        this.cap = PaystackFees.DEFAULT_LOCAL_NGN_CAP;
    }

    get chargeDivider() {
        return 1 - this.percentage;
    }

    get crossover() {
        return this.threshold * this.chargeDivider - this.additionalCharge;
    }

    get flatlinePlusCharge() {
        return (this.cap - this.additionalCharge) / this.percentage;
    }

    get flatline() {
        return this.flatlinePlusCharge - this.cap;
    }

    /**
     * @description set the percentage
     * @throws if percentage sent is invalid
     * @param {number} percentage - positive number less than 1
     * @returns the current PaystackFees object
     */
    withPercentage(percentage) {
        Joi.assert(
            { percentage },
            Joi.object({
                percentage: Joi.number()
                    .positive()
                    .less(1)
                    .allow(0)
                    .required(),
            }),
        );
        this.percentage = percentage;
        return this;
    }

    /**
     * @description set the additional charge which will be added if the amount is over threshold
     * @throws if additional charge sent is invalid
     * @param {number} additionalCharge - 0 or more
     * @returns the current PaystackFees object
     */
    withAdditionalCharge(additionalCharge) {
        Joi.assert(
            { additionalCharge },
            Joi.object({
                additionalCharge: Joi.number()
                    .positive()
                    .integer()
                    .allow(0)
                    .required(),
            }),
        );
        this.additionalCharge = additionalCharge;
        return this;
    }

    /**
     * @description set the threshold, beyond which additional charge
     * will be added to fees.
     * @throws if threshold sent is invalid
     * @param {number} threshold - 0 or more
     * @returns the current PaystackFees object
     */
    withThreshold(threshold) {
        Joi.assert(
            { threshold },
            Joi.object({
                threshold: Joi.number()
                    .positive()
                    .integer()
                    .allow(0)
                    .required(),
            }),
        );
        this.threshold = threshold;
        return this;
    }

    /**
     * @description set the cap
     * @throws if cap sent is invalid
     * @param {number} cap - positive number greater than or equal to 1
     * @returns the current PaystackFees object
     */
    withCap(cap) {
        Joi.assert(
            { cap },
            Joi.object({
                cap: Joi.number()
                    .positive()
                    .integer()
                    .required(),
            }),
        );
        this.cap = cap;
        return this;
    }

    /**
     * @description calculate amount to be sent to paystack to be settled the amount provided
     * @throws if amountInLowerDenomination sent is invalid
     * @param {number} amountInLowerDenomination - The amount we want to be settled after
     * paystack deducts fees
     * @returns amount you should send in lower denomination
     * @example paystackFee.addTo(10000) // add fees so we can be settled 100 in higher denomination
     */
    addTo(amountInLowerDenomination) {
        Joi.assert(
            { amountInLowerDenomination },
            Joi.object({
                amountInLowerDenomination: Joi.number()
                    .positive()
                    .integer()
                    .allow(0)
                    .required(),
            }),
        );
        if (this.percentage === 0) {
            return amountInLowerDenomination + Math.min(this.cap, this.additionalCharge);
        }

        if (amountInLowerDenomination > this.flatline) {
            return amountInLowerDenomination + this.cap;
        }

        if (amountInLowerDenomination > this.crossover) {
            return Math.ceil(
                (amountInLowerDenomination + this.additionalCharge) / this.chargeDivider,
            );
        }

        return Math.ceil(amountInLowerDenomination / this.chargeDivider) || 1;
    }

    /**
     * @description Calculates the fee for an amount in lower denomination
     * @throws if amountInLowerDenomination sent is invalid
     * @param {number} amountInLowerDenomination - The amount we want to send to paystack
     * @returns fees in lower denomination
     * @example
     * // calculate the charge that will be deducted if
     * // a local cards pays 100 naira
     * const amountInKobo = 10000; // 10000 kobo is 100 naira
     * paystackFee.calculateFor(amountInKobo);
     */
    calculateFor(amountInLowerDenomination) {
        Joi.assert(
            { amountInLowerDenomination },
            Joi.object({
                amountInLowerDenomination: Joi.number()
                    .positive()
                    .integer()
                    .allow(0)
                    .required(),
            }),
        );
        const flat = amountInLowerDenomination > this.threshold ? this.additionalCharge : 0;
        const fees = Math.ceil(this.percentage * amountInLowerDenomination + flat);
        return Math.min(fees, this.cap);
    }
}

PaystackFees.DEFAULT_LOCAL_NGN_PERCENTAGE = 0.015;
PaystackFees.DEFAULT_LOCAL_NGN_ADDITIONAL_CHARGE = 10000;
PaystackFees.DEFAULT_LOCAL_NGN_THRESHOLD = 250000;
PaystackFees.DEFAULT_LOCAL_NGN_CAP = 200000;

module.exports = PaystackFees;
