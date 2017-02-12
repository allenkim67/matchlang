const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');

router.post('/', async (req, res) => {
  const charge = stripe.charges.create({
    amount: req.body.amount, // Amount in cents
    currency: "usd",
    source: req.body.id,
    description: "User deposit"
  }, async (err, charge) => {
    if (err && err.type === 'StripeCardError') {
      res.status(400).send('The card has been declined');
    } else {
      await User.incrCredits(req.authUser.id, req.body.amount);
      res.send({amount: req.body.amount});
    }
  });
});

module.exports = router;