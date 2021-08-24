"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fbMiddleware = exports.fbStoreContent = void 0;
const firebase_1 = __importDefault(require("firebase"));
const fbKey_1 = require("./fbKey");
/**
 * @brief Helper enum for the read from firestore function.
 */
var fbStoreContent;
(function (fbStoreContent) {
    fbStoreContent[fbStoreContent["document"] = 1] = "document";
    fbStoreContent[fbStoreContent["collection"] = 2] = "collection";
})(fbStoreContent = exports.fbStoreContent || (exports.fbStoreContent = {}));
/**
 * @brief Firebase middleware
 * * API Key has to be passed in via the fbKey.ts
 * file
 */
class fbMiddleware {
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<========================================== Constructor ==========================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    constructor() {
        firebase_1.default.initializeApp(fbKey_1.firebaseKey);
        this.firestore = firebase_1.default.firestore();
        this.realtimeDB = firebase_1.default.database();
    }
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<============================================ Firestore ==========================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /**
     * @brief Reads data from the specified
     * location.
     * * contentType: Specifies wether a list of fields be returned from a document or a list of
     *                documents.
     * @returns The data stored within the document/collection (null if nothing found/error).
     */
    read_from_firestore(path, contentType, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (contentType) {
                case fbStoreContent.document:
                    let doc;
                    (yield this.firestore.doc(path)
                        .get()
                        .then((data) => {
                        // I dont't like this but .data() can also return a
                        // undefined although nearly every other function returns null.
                        // I just want to enforce the same type null.
                        doc = data.data();
                        if (doc === undefined) {
                            doc = null;
                        }
                        // Is a debug message specified?
                        if (debugMessage !== undefined) {
                            console.log(debugMessage);
                        }
                        // Is a debug message specified?
                    })
                        .catch((error) => {
                        doc = null;
                        console.log(`Error while attempting to read from ${path}`);
                        // Is a debug message specified?
                        if (debugMessage !== undefined) {
                            console.log(debugMessage);
                        }
                        // Is a debug message specified?
                    }));
                    return doc;
                case fbStoreContent.collection:
                    const collection = (yield this.firestore.collection(path).get()).docs;
                    let names = new Array();
                    collection.map((name) => names.push(name.id));
                    return names;
            }
        });
    }
    /**
     * @brief Writes data at a specific location.
     * * NOTE: If necessary new documents/subcolletions will be created. If a document at that
     *         location already exists it will be overwritten entirly.
     *
     * @param path
     * @param object
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    write_to_firestore(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.firestore.doc(path)
                .set(object)
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to write to ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Updates a document at a specific location.
     * * NOTE: Only specified fields will be overwitten. If the field does not exist it will be
     *         added.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    update_doc_firestore(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.firestore.doc(path)
                .update(object)
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to update the document at the location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Deletes a document at a specific location
     * * NOTE: Deleting collection/subcollections is not recommended.
     * @param path
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    delete_firestore(path, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.firestore.doc(path)
                .delete()
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to delete at location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Attaches a listner with the specified callback passed in.
     * @param path
     * @param func The callback executed onChange.
     * @param debugMessage
     * @returns The function to unsubscribe from the listner.
     */
    attach_listner_firestore(path, func, debugMessage) {
        return this.firestore.doc(path).onSnapshot((docSnapshot) => {
            // Execute passed in callback onChange.
            func(docSnapshot.data());
            // Is a debug message specified?
            if (debugMessage !== undefined) {
                console.log(debugMessage);
            }
            // Is a debug message specified?
        }, (error) => {
            console.log(`Error while attempting to attach a listner at location ${path}`);
            console.log(error);
            // Is a debug message specified?
            if (debugMessage !== undefined) {
                console.log(debugMessage);
            }
            // Is a debug message specified?
        });
    }
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<======================================= Realtime database =======================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /**
     * @brief Writes to the realtime database at the specified location.
     * @param path
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    write_database(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.realtimeDB.ref(path)
                .set(object)
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to write at location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Reads from the realtime database at the specified location.
     * @param path
     * @param debugMessage
     * @returns The read datab from the specified location (null if not nothing found/error).
     */
    read_database(path, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let readObject;
            (yield this.realtimeDB.ref(path)
                .get()
                .then((snapshot) => {
                // Does the database snapshot contain data?
                if (snapshot.exists()) {
                    readObject = snapshot.val();
                }
                else {
                    readObject = null;
                }
                // Does the database snapshot contain data?
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                readObject = null;
                console.log(`Error while attempting to read from location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return readObject;
        });
    }
    /**
     * @brief Deletes an entire object with all underlying data.
     * @param path
     * @param debugMessage
     * @returns Wether the oepration wass successful.
     */
    delete_database(path, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.realtimeDB.ref(path)
                .remove()
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to read from location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Updates only in the passed in object specified child nodes.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    update_childnodes_database(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.realtimeDB.ref(path)
                .update(object)
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to read from location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Deletes specific childnodes.
     * * IMPORTANT: You specify which objects you want to delete
     *             via passing in an object with the same keyname and the value null.
     *             You can essantially also use the write, update_childnodes to remove specific child nodes.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Wether the operation was successful.
     */
    delete_childnodes_database(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield this.realtimeDB.ref(path)
                .update(object)
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(`Error while attempting to read from location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
    /**
     * @brief Appends another child to the specified location (new ID will be created)
     * @param path
     * @param object
     * @param debugMessage
     * @returns The new ID to access the piece of data (null if unsuccessful).
     */
    append_database(path, object, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let newKey = null;
            (yield this.realtimeDB.ref(path)
                .push(object)
                .then((response) => {
                newKey = response.key;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                newKey = null;
                console.log(`Error while attempting to read from location ${path}`);
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return newKey;
        });
    }
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<======================================= Authentication ==========================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /**
     * @brief Creates a new user with a specified email and password.
     * @param email
     * @param password
     * @param debugMessage
     * @returns The user object (null if error/not found).
     */
    create_new_user(email, password, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let new_user = null;
            (yield firebase_1.default.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                new_user = userCredential.user;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                new_user = null;
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return new_user;
        });
    }
    /**
     * @brief Signs in a user with the specified email and password.
     * @param email
     * @param password
     * @param debugMessage
     * @returns The user object (null if error/not found).
     */
    sign_user_in(email, password, debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let new_user = null;
            (yield firebase_1.default.auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                new_user = userCredential.user;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                new_user = null;
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return new_user;
        });
    }
    sign_user_out(debugMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            (yield firebase_1.default.auth()
                .signOut()
                .then(() => {
                success = true;
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            })
                .catch((error) => {
                success = false;
                console.log(error);
                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            }));
            return success;
        });
    }
}
exports.fbMiddleware = fbMiddleware;
;
