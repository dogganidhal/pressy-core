import {Member} from "../model/entity/users/member";
import {http} from "../utils/http";

export namespace exception {

	export abstract class APIException {
		protected constructor(public name: string, public statusCode: number, public message: string) {}
	}

	export class MissingFieldsException extends APIException {
		constructor(fields: string) {
			super('Champs manquants', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Les champs suivants sont obligatoires : ${fields}`);
		}
	}

  export class PasswordResetCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Reset code ${code} was not found`);
    }
  }

  export class PasswordResetCodeExpiredException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeExpiredException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Reset code ${code} has already expired`);
    }
  }

  export class WrongPasswordException extends APIException {
    constructor() {
      super('Mot de passe faux', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Le mot de passe que vous avez introduit ne correspond pas à votre compte`);
    }
  }

  export class AccountNotFoundException extends APIException {
    constructor(email: string) {
			super('Membre non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun membre avec l'email '${email}' n'a été trouvé`);
    }
	}
	
	export class MemberNotFoundException extends APIException {
    constructor(id: number) {
      super('Membre non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun membre avec l'id '${id}' n'a été trouvé`);
    }
  }

  export class UnauthenticatedRequestException extends APIException {
    constructor() {
      super('Accès refusé', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Il faut fournir un jeton d'accès pour accèder à la ressource demandée`);
    }
  }

  export class AccessTokenNotFoundException extends APIException {
    constructor() {
			super('Session invalide', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Le jeton de votre session n'est pas valide`);
    }
	}
	
	export class ArticleNotFound extends APIException {
    constructor(id: number) {
			super('Article non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun article avec l'id '${id}' n'a été trouvé`);
    }
  }

  export class AccessTokenExpiredException extends APIException {
    constructor() {
      super('Session expirée', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Votre session a éxpiré`);
    }
  }

  export class InvalidAccessTokenException extends APIException {
    constructor() {
			super('Session invalide', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Le jeton de votre session n'est pas valide`);
    }
  }

	export class InvalidRefreshTokenException extends APIException {
		constructor() {
			super('Session invalide', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Le jeton de votre session n'est pas valide`);
		}
	}

	export class InactiveMemberException extends APIException {
		constructor(member: Member) {
			super('Membre non actif', http.HttpStatus.HTTP_STATUS_FORBIDDEN, `Le membre '${member.person.firstName}' n'est pas actif, veuillez activer votre compte`);
		}
	}

  export class EmailAlreadyExistsException extends APIException {
    constructor(email?: string) {
      super('Email existant', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Un compte avec l'email ${email ? "'" + email + "' " : ""}existe déjà`);
    }
  }

  export class PhoneAlreadyExists extends APIException {
    constructor(phone?: string) {
      super('Téléphone existant', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Le Téléphone ${phone ? "'" + phone + "' " : ""}existe déjà`);
    }
  }

	export class InvalidEmailException extends APIException {
		constructor(email: string) {
			super('Email non valide', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `l'email '${email}' n'est pas valide`);
		}
	}

	export class InvalidPhoneException extends APIException {
		constructor(phone: string) {
			super('Téléphone non valide', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `le téléphone '${phone}' n'est pas valide`);
		}
	}

	export class InvalidPasswordException extends APIException {
		constructor(message: string) {
			super('Mot de passe non valide', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `le mot de passe est invalide : '${message}`);
		}
	}

  export class EmailValidationCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('Code de validation non trouvé', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `le code de validation '${code}' n'existe pas`);
    }
  }

	export class PhoneValidationCodeNotFoundException extends APIException {
		constructor(code: string) {
			super('Code de validation non trouvé', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `le code de validation '${code}' n'existe pas`);
		}
	}

	export class RouteNotFoundException extends APIException {
		constructor() {
			super('RouteNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Route not found`);
		}
  }
  
  export class MethodNotAllowedException extends APIException {
		constructor(method: string) {
			super('Méthode non supportée', http.HttpStatus.HTTP_STATUS_METHOD_NOT_ALLOWED, `la méthode '${method}' n'est pas supportée pour cet endpoint`);
		}
	}

  export class SlotNotFoundException extends APIException {
    constructor(slotId: number) {
      super('Créneau non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun créneau avec l'id ${slotId} n'a été trouvé`);
    }
	}
	
	export class OrderStatusUpdateNotFound extends APIException {
    constructor(type: string) {
      super('OrderStatusUpdateNotFound', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Order update type '${type}' is not supported`);
    }
  }

	export class DriverSlotNotFoundException extends APIException {
		constructor(slotId: number) {
			super('Créneau chauffeur non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun créneau chauffeur avec l'id ${slotId} n'a été trouvé`);
		}
  }
  
  export class DriverNotFoundException extends APIException {
		constructor(driverId: number) {
			super('Chauffeur non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `aucun chaffeur avec l'id ${driverId} n'a été trouvé`);
		}
  }

  export class CannotCreateAddressException extends APIException {
	  constructor() {
			super('Impossible de créer l\'adresse', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Impossible de créer l'adresse, il faut fournir un Google Place Id ou des coordonnées GPS`);
	  }
  }
  
  export class AddressNotFoundException extends APIException {
	  constructor(id: number) {
		  super('Adresse non trouvée', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucune adresse avec l'id '${id}' n'a été trouvée`);
	  }
	}

	export class PaymentAccountNotFoundException extends APIException {
	  constructor(id: string) {
		  super('Moyen de paiement non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucun moyen de paiement avec l'id '${id}' n'a été trouvé`);
	  }
	}

 export class CannotDeleteAddressException extends APIException {
	constructor(id: number) {
	 super('Impossible de supprimer l\'adresse', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Impossible de supprimer l'adresse avec l'id '${id}', c'est peut être car c'est votre seul adresse renseignée`);
	}
 }

	export class CannotUpdateAddressException extends APIException {
		constructor(id: number) {
			super('Impossible de mettre à l\'adresse', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Impossible de modifier l'adresse avec l'id '${id}'`);
		}
	}

	export class EmptyOrderException extends APIException {
		constructor() {
			super('EmptyOrderException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `No items in this order, please select some`);
		}
  }
  
  export class OrderNotFoundException extends APIException {
		constructor(orderId: number) {
			super('OrderNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No order with id ${orderId} was found`);
		}
  }

	export class MobileDeviceNotFoundException extends APIException {
	 constructor(deviceId: string) {
		super('MobileDeviceNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No device with id ${deviceId} was found`);
	 }
	}

	export class CannotDeleteMobileDeviceException extends APIException {
	 constructor(deviceId: string) {
		super('CannotDeleteMobileDeviceException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Device with id ${deviceId} cannot be deleted`);
	 }
	}

	export class LaundryPartnerNotFound extends APIException {
		constructor(laundryPartnerId: number) {
			super('Partenaire non trouvé', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Aucune partenaire avec l'id '${laundryPartnerId}' n'a été trouvé`);
		}
	}
}