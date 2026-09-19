/**
 * Middleware de validation zod : valide le corps (body) de la requête.
 * En cas d'échec renvoie 422 avec le détail aplati ; sinon place le résultat
 * dans `req.validated` et passe au handler suivant.
 */
function validate(bodySchema) {
  return (req, res, next) => {
    const result = bodySchema.safeParse(req.body);
    if (!result.success) return res.status(422).json({ detail: result.error.flatten() });
    req.validated = result.data;
    next();
  };
}
module.exports = validate;