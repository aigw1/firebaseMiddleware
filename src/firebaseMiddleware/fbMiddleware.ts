import firebase from 'firebase';

/**
 * @brief Helper enum for the read from firestore function.
 */
export enum fbStoreContent {
    document = 1,
    collection,
}

/**
 * @brief Firebase middleware
 * * API Key has to be passed in via the fbKey.ts
 * file
 */
export class fbMiddleware {
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<======================================= Firestore references ====================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/

    private firestore: firebase.firestore.Firestore;
    private realtimeDB: firebase.database.Database;
    private auth: firebase.auth.Auth;

    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<========================================== Constructor ==========================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/

    constructor(firebaseKey: Object) {
        firebase.initializeApp(firebaseKey);
        this.firestore = firebase.firestore();
        this.realtimeDB = firebase.database();
        this.auth = firebase.auth();
    }

    /*<=================================================================================================>*/
    /*<=================================================================================================>*/
    /*<============================================ Firestore ==========================================>*/
    /*<=================================================================================================>*/
    /*<=================================================================================================>*/

    /**
     * @brief Reads data from the specified
     * location.
     * * contentType: Specifies whether a list or fields or a list of docments will be returned.
     * @returns The data stored within the document/collection (null if nothing
     *     found/error).
     */
    public async read_from_firestore(
        path: string, contentType: fbStoreContent, debugMessage?: string): Promise<any> {
        switch (contentType) {
            case fbStoreContent.document:
                let doc: null | firebase.firestore.DocumentData | undefined = null;
                (await this.firestore.doc(path)
                    .get()
                    .then(
                        (data) => {
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
                    .catch(
                        (error) => {
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
                const collection = (await this.firestore.collection(path).get()).docs;
                let names: Array<string> = new Array<string>();
                collection.map((name) => names.push(name.id))
                return names;
        }
    }

    /**
     * @brief Writes data at a specific location.
     * * NOTE: If necessary new documents/subcolletions will be created. If a
     * document at that location already exists it will be overwritten entirly.
     *
     * @param path
     * @param object
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async write_to_firestore(path: string, object: Object, debugMessage?: string):
        Promise<boolean> {
        let success: boolean = false;
        (await this.firestore.doc(path)
            .set(object)
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Updates a document at a specific location.
     * * NOTE: Only specified fields will be overwitten. If the field does not
     * exist it will be added.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async update_doc_firestore(path: string, object: Object, debugMessage?: string):
        Promise<boolean> {
        let success: boolean = false;
        (await this.firestore.doc(path)
            .update(object)
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
                    success = false;
                    console.log(
                        `Error while attempting to update the document at the location ${path}`);
                    console.log(error);

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                }))
        return success;
    }

    /**
     * @brief Deletes a document at a specific location
     * * NOTE: Deleting collection/subcollections is not recommended.
     * @param path
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async delete_firestore(path: string, debugMessage?: string): Promise<boolean> {
        let success: boolean = false;
        (await this.firestore.doc(path)
            .delete()
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Attaches a listner with the specified callback passed in.
     * @param path
     * @param func The callback executed onChange.
     * @param debugMessage
     * @returns The function to unsubscribe from the listner.
     */
    public attach_listner_firestore(path: string, func: Function, debugMessage?: string): Function {
        return this.firestore.doc(path).onSnapshot(
            (docSnapshot) => {
                // Execute passed in callback onChange.
                func(docSnapshot.data());

                // Is a debug message specified?
                if (debugMessage !== undefined) {
                    console.log(debugMessage);
                }
                // Is a debug message specified?
            },
            (error) => {
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
     * @returns Whether the operation was successful.
     */
    public async write_database(path: string, object: Object, debugMessage?: string):
        Promise<boolean> {
        let success: boolean = false;
        (await this.realtimeDB.ref(path)
            .set(object)
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Reads from the realtime database at the specified location.
     * @param path
     * @param debugMessage
     * @returns The read data from the specified location (null if not nothing
     *     found/error).
     */
    public async read_database<Type>(path: string, debugMessage?: string): Promise<Type | null> {
        let readObject: Object | null = null;
        (await this.realtimeDB.ref(path)
            .get()
            .then(
                (snapshot) => {
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
            .catch(
                (error) => {
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
    }

    /**
     * @brief Deletes an entire object with all underlying data.
     * @param path
     * @param debugMessage
     * @returns Whether the oepration wass successful.
     */
    public async delete_database(path: string, debugMessage?: string): Promise<boolean> {
        let success: boolean = false;
        (await this.realtimeDB.ref(path)
            .remove()
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Updates only in the passed in object specified child nodes.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async update_childnodes_database(path: string, object: Object, debugMessage?: string):
        Promise<boolean> {
        let success: boolean = false;
        (await this.realtimeDB.ref(path)
            .update(object)
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Deletes specific childnodes.
     * * IMPORTANT: You specify which objects you want to delete
     *             via passing in an object with the same keyname and the value
     * null. You can essantially also use the write, update_childnodes to remove
     * specific child nodes.
     * @param path
     * @param object
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async delete_childnodes_database(path: string, object: Object, debugMessage?: string):
        Promise<boolean> {
        let success: boolean = false;
        (await this.realtimeDB.ref(path)
            .update(object)
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    }

    /**
     * @brief Appends another child to the specified location (new ID will be
     * created)
     * @param path
     * @param object
     * @param debugMessage
     * @returns The new ID to access the piece of data (null if unsuccessful).
     */
    public async append_database(path: string, object: Object, debugMessage?: string):
        Promise<string | null> {
        let newKey: string | null = null;
        (await this.realtimeDB.ref(path)
            .push(object)
            .then(
                (response) => {
                    newKey = response.key;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
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
    public async create_new_user(email: string, password: string, debugMessage?: string):
        Promise<firebase.User | null> {
        let new_user: firebase.User | null = null;
        (await this.auth.createUserWithEmailAndPassword(email, password)
            .then(
                (userCredential) => {
                    new_user = userCredential.user;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
                    new_user = null;
                    console.log(error);

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                }));
        return new_user;
    }

    /**
     * @brief Signs in a user with the specified email and password.
     * @param email
     * @param password
     * @param debugMessage
     * @returns The user object (null if error/not found).
     */
    public async sign_user_in(email: string, password: string, debugMessage?: string):
        Promise<firebase.User | null> {
        let new_user: firebase.User | null = null;
        (await this.auth.signInWithEmailAndPassword(email, password)
            .then(
                (userCredential) => {
                    new_user = userCredential.user;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
                    new_user = null;
                    console.log(error);

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                }));
        return new_user;
    }

    /**
     * @brief Signs the currently logged in user out.
     * @param debugMessage
     * @returns Whether the operation was successful.
     */
    public async sign_user_out(debugMessage?: string): Promise<boolean> {
        let success: boolean = false;
        (await this.auth.signOut()
            .then(
                () => {
                    success = true;

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                })
            .catch(
                (error) => {
                    success = false;
                    console.log(error);

                    // Is a debug message specified?
                    if (debugMessage !== undefined) {
                        console.log(debugMessage);
                    }
                    // Is a debug message specified?
                }));
        return success;
    }
};