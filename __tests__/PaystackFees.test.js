jest.dontMock('joi');
const PaystackFees = require('../PaystackFees');

describe('PaystackFees', () => {
    test('new should return a new instance', () => {
        const paystackFees = new PaystackFees();
        expect(paystackFees).toHaveProperty('percentage');
        expect(paystackFees).toHaveProperty('additionalCharge');
        expect(paystackFees).toHaveProperty('threshold');
        expect(paystackFees).toHaveProperty('cap');
        expect(paystackFees).toHaveProperty('addTo');
        expect(paystackFees).toHaveProperty('calculateFor');
    });

    describe('addTo', () => {
        test('should return 10100 for 10000 when cap is 100, threshold is 10000 and percentage is 0.01', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(0)
                .withPercentage(0.01)
                .withCap(100)
                .withThreshold(10000);
            const amountToSendInLowerDenomination = paystackFees.addTo(10000);
            expect(amountToSendInLowerDenomination).toEqual(10100);
        });

        test('should return 10102 for 10000 when cap is 200, threshold is 10000 and percentage is 0.01', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(0)
                .withPercentage(0.01)
                .withCap(200)
                .withThreshold(10000);
            const amountToSendInLowerDenomination = paystackFees.addTo(10000);
            expect(amountToSendInLowerDenomination).toEqual(10102);
        });

        test('should return original value when result of calculateFor is deducted from original', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(1000)
                .withPercentage(0.01)
                .withCap(200000)
                .withThreshold(250000);
            const originals = [1, 2, 10000, 11000, 20000, 492983, 4981, 100000, 1000000, 10000000];
            for (let index = 0; index < originals.length; index += 1) {
                const original = originals[index];
                const afterDeduction = original - paystackFees.calculateFor(original);
                expect(paystackFees.addTo(afterDeduction)).toEqual(original);
            }
        });

        test('should return 11000 when percentage is 0 and additional charge is 1000', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(1000)
                .withPercentage(0)
                .withCap(200000)
                .withThreshold(250000);
            const amountToSendInLowerDenomination = paystackFees.addTo(10000);
            expect(amountToSendInLowerDenomination).toEqual(11000);
        });

        test('should return 10153 for 10000 when at default', () => {
            const paystackFees = new PaystackFees();
            const amountToSendInLowerDenomination = paystackFees.addTo(10000);
            expect(amountToSendInLowerDenomination).toEqual(10153);
        });
    });


    describe('calculateFor', () => {
        test('should return 100 for 10000 when cap is 100, threshold is 10000 and percentage is 0.02', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(0)
                .withPercentage(0.02)
                .withCap(100)
                .withThreshold(10000);
            const amountToSendInLowerDenomination = paystackFees.calculateFor(10000);
            expect(amountToSendInLowerDenomination).toEqual(100);
        });

        test('should return 200 for 10000 when cap is 300, threshold is 10000 and percentage is 0.02', () => {
            const paystackFees = new PaystackFees()
                .withAdditionalCharge(0)
                .withPercentage(0.02)
                .withCap(300)
                .withThreshold(100);
            const amountToSendInLowerDenomination = paystackFees.calculateFor(10000);
            expect(amountToSendInLowerDenomination).toEqual(200);
        });

        test('should return 153 for 10153 when at default', () => {
            const paystackFees = new PaystackFees();
            const amountToSendInLowerDenomination = paystackFees.calculateFor(10153);
            expect(amountToSendInLowerDenomination).toEqual(153);
        });
    });
});
