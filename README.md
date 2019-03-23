<a name="PaystackFees"></a>

## PaystackFees
A class for managing Paystack fees in your application.

Installation
============
**Peer Dependency (required)**

Install Joi which we have employed for validating parameters sent to functions in this library
```
npm install --save joi
```
Now install the module
```
npm install --save paystack-fees
```


Sample Usage
============
```javascript
const PaystackFees = require('paystack-fees');
// The lines below will create a new object that calculates fees based on the fee
// schedule for USD payments. The cap is set to an arbitrarily high number since there
// is no cap.
const paystackFees = (new PaystackFees())
            .withPercentage(0.035)
            .withAdditionalCharge(0)
            .withCap(1000000000000)
            .withThreshold(0);

// you can now calculate fees for an amount by calling the `calculateFor` function
const feesFor1000USD = paystackFees.calculateFor(100000);
// or the amount to be sent when we intend to be settled a target amount
const amountToSendToBeSettled50USD = paystackFees.addTo(5000);
```

**Kind**: global class  

* [PaystackFees](#PaystackFees)
    * [.withPercentage(percentage)](#PaystackFees+withPercentage) ⇒
    * [.withAdditionalCharge(percentage)](#PaystackFees+withAdditionalCharge) ⇒
    * [.withThreshold(percentage)](#PaystackFees+withThreshold) ⇒
    * [.withCap(percentage)](#PaystackFees+withCap) ⇒
    * [.addTo(amountInLowerDenomination)](#PaystackFees+addTo) ⇒
    * [.calculateFor(amountInLowerDenomination)](#PaystackFees+calculateFor) ⇒

<a name="PaystackFees+withPercentage"></a>

### paystackFees.withPercentage(percentage) ⇒
set the percentage

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: the current PaystackFees object  
**Throws**:

- if percentage sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| percentage | <code>number</code> | positive number less than 1 |

<a name="PaystackFees+withAdditionalCharge"></a>

### paystackFees.withAdditionalCharge(percentage) ⇒
set the additional charge which will be added if the amount is over threshold

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: the current PaystackFees object  
**Throws**:

- if additional charge sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| percentage | <code>number</code> | positive number less than 1 |

<a name="PaystackFees+withThreshold"></a>

### paystackFees.withThreshold(percentage) ⇒
set the threshold, beyond which additional charge
will be added to fees.

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: the current PaystackFees object  
**Throws**:

- if threshold sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| percentage | <code>number</code> | positive number less than 1 |

<a name="PaystackFees+withCap"></a>

### paystackFees.withCap(percentage) ⇒
set the cap

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: the current PaystackFees object  
**Throws**:

- if cap sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| percentage | <code>number</code> | positive number less than 1 |

<a name="PaystackFees+addTo"></a>

### paystackFees.addTo(amountInLowerDenomination) ⇒
calculate amount to be sent to paystack to be settled the amount provided

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: amount se should send in lower denomination  
**Throws**:

- if amountInLowerDenomination sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| amountInLowerDenomination | <code>number</code> | The amount we want to be settled after paystack deducts fees |

**Example**  
```js
paystackFee.addTo(10000) // add fees so we can be settled 100 in higher denomination
```
<a name="PaystackFees+calculateFor"></a>

### paystackFees.calculateFor(amountInLowerDenomination) ⇒
Calculates the fee for an amount in lower denomination

**Kind**: instance method of [<code>PaystackFees</code>](#PaystackFees)  
**Returns**: fees in lower denomination  
**Throws**:

- if amountInLowerDenomination sent is invalid


| Param | Type | Description |
| --- | --- | --- |
| amountInLowerDenomination | <code>number</code> | The amount we want to send to paystack |

**Example**  
```js
// calculate the charge that will be deducted if
// a local cards pays 100 naira
const amountInKobo = 10000; // 10000 kobo is 100 naira
paystackFee.calculateFor(amountInKobo);
```
