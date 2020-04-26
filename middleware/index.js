exports.validateInput = function(req, res, next) {
	const { address_line_one: street, city, state, zip_code: postalcode } = req.query;
	if (
		!Object.keys(req.query).length ||
		!street ||
		!city ||
		!state ||
		!postalcode ||
		hasInvalidCharacter(street.trim(), city.trim(), state.trim(), postalcode.trim())
	) {
		const error = new Error('Invalid request');
		error.statusCode = 400;
		return next(error);
	}
	console.log(req.query);
	return next();
};

const hasInvalidCharacter = (...args) =>
	!args.every((value) => {
		if (!value.length) return false;
		for (let locale in validCharactersInLocale) {
			if (validCharactersInLocale[locale].test(value)) return true;
		}
		return false;
	});

const validCharactersInLocale = {
	'en-US'       : /^[ ,0-9A-Z]+$/i,
	'bg-BG'       : /^[ ,0-9А-Я]+$/i,
	'cs-CZ'       : /^[ ,0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
	'da-DK'       : /^[ ,0-9A-ZÆØÅ]+$/i,
	'de-DE'       : /^[ ,0-9A-ZÄÖÜß]+$/i,
	'el-GR'       : /^[ ,0-9Α-ω]+$/i,
	'es-ES'       : /^[ ,0-9A-ZÁÉÍÑÓÚÜ]+$/i,
	'fr-FR'       : /^[ ,0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
	'it-IT'       : /^[ ,0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
	'hu-HU'       : /^[ ,0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
	'nb-NO'       : /^[ ,0-9A-ZÆØÅ]+$/i,
	'nl-NL'       : /^[ ,0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
	'nn-NO'       : /^[ ,0-9A-ZÆØÅ]+$/i,
	'pl-PL'       : /^[ ,0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
	'pt-PT'       : /^[ ,0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
	'ru-RU'       : /^[ ,0-9А-ЯЁ]+$/i,
	'sl-SI'       : /^[ ,0-9A-ZČĆĐŠŽ]+$/i,
	'sk-SK'       : /^[ ,0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
	'sr-RS@latin' : /^[0-9A-ZČĆŽŠĐ]+$/i,
	'sr-RS'       : /^[ ,0-9А-ЯЂЈЉЊЋЏ]+$/i,
	'sv-SE'       : /^[ ,0-9A-ZÅÄÖ]+$/i,
	'tr-TR'       : /^[ ,0-9A-ZÇĞİıÖŞÜ]+$/i,
	'uk-UA'       : /^[ ,0-9А-ЩЬЮЯЄIЇҐі]+$/i,
	'ku-IQ'       : /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ, ]+$/i,
	ar            : /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ, ]+$/,
	he            : /^[ ,0-9א-ת]+$/,
	'fa-IR'       : /^[' ,0-9آابپتثجچهخدذرزژسشصضطظعغفقکگلمنوهی۱۲۳۴۵۶۷۸۹۰']+$/i
};
