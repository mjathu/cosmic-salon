import { environment } from "environments/environment";

export class Const {

    static readonly apiBaseUrl = environment.apiUrl;

    static readonly storageKeyName = {
        currentUser: 'currentUser'
    };

}