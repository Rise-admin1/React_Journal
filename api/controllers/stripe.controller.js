import dotenv from 'dotenv'
import stripe from 'stripe';
dotenv.config()


const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'https://scientificjournalsportal.com';
// const YOUR_DOMAIN = 'http://localhost:5173';
// const YOUR_DOMAIN = 'https://scientificjournalsportal.com';


export const createCheckoutSession = async (req, res, next) => {
  let price;
  // req.body.articleId? price = "price_1P2sRtFGVHo1I2AtMozyX4gc" : "price_1P2sd1FGVHo1I2AtH9gCkV6m"
  try{
    const session = await Stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          
          price: 'price_1P2rwiFGVHo1I2AttFh5meyW',
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata:{
        articleId:req.body.articleId
      },
      return_url: `${YOUR_DOMAIN}/returnPayment?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log(session, 'session in api');
  
    res.send({clientSecret: session.client_secret});
  }
  catch(err){
    console.log(err, 'error in stripe');
    res.status(500).send({error: err.message});
  }
  
  
};

export const returnSessionStatus = async (req, res, next) => {
  const session = await Stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
};

export const createCheckoutSessionForSubscription = async (req, res, next) => {

  const prices = await Stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
 
  const session = await Stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/productDisplay/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  
  res.redirect(303, session.url);

}

export const createPortalSessionForSubscription = async (req, res, next) => {
const  session_id  = 'cs_test_a1hQJ9VSuJFQOLpNX3mFT0RVFZcb9shdeTyrp9l0ceyOJ7Lqb64DiqjDEZ';
const checkoutSession = await Stripe.checkout.sessions.retrieve(session_id);
  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await Stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
}