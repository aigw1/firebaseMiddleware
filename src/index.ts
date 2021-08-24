import firebase from 'firebase';
import { fbMiddleware, fbStoreContent } from './firebaseMiddleware/fbMiddleware';


const fb = new fbMiddleware();

// Read data from the firestore
// Wether you are trying to get a subcolletion or a entire document is up to you
// to make sure that you make the write call, otherwise it will crash really hard
fb.read_from_firestore('clients', fbStoreContent.collection)
    .then(
        (datasnapshot) => {
            console.log(datasnapshot);
        });

// Wirte data to the firestore
// Just make sure that you watch after the specified path. Writing a document into a document is not
// working.
fb.write_to_firestore('clients/test87324', { name: 'Hallo', num: 404 }, 'test')
    .then(
        (result) => {
            console.log(result);
        });

// Passing in nested Object into a document is also fine.
fb.write_to_firestore('clients/test87324', { name: 'Hallo', num: 404, zzz: { re: 'zrz' } }, 'test')
    .then(
        (result) => {
            console.log(result);
        });

// Update a document at a specific location
fb.update_doc_firestore('clients/test11', { name: 'jes', TT: 444 })
    .then(
        (result) => {
            console.log(result);
        })

//Not tested yet would be cautious when using it.
fb.attach_listner_firestore(
    'clients/test11',
    // Disclaimer: I did not find a cleaner way
    // to implement types than just straight up importing firebase into index.ts.
    // This was made inorder to have autocompletion, otherwise it would be hell.
    (docSnapshot: firebase.firestore.DocumentData) => {
        console.log(`Current state: ${docSnapshot}`);
    });

let allExe = new Date().getTime();
for (let i = 0; i < 300; i++) {
    fb.write_database('users', { name: 'Jes', num: 444 })
        .then(
            (result) => {
                if (i > 298) {
                    console.log(`start1: ${new Date().getTime() - allExe}`);
                }
                console.log(result);
            });
}

fb.write_database('users/jack', { name: 'Jack', age: 18 })
    .then(
        (result) => {
            console.log(result);
        });

fb.read_database('users/jack')
    .then(
        (data) => {
            console.log(data);
        })

fb.write_database('users/jack', { name: 'Jack', age: 20 })
    .then(
        (result) => {
            if (result) {
                fb.update_childnodes_database('users/jack', { age: 16 })
                    .then(
                        (result1) => {
                            console.log(result1);
                        });
            }
        });

fb.delete_database('users/jack')
    .then(
        (result) => {
            console.log(result);
        })

// Creates anotrher child node/ obtain the newKey and then update the new value.
fb.append_database('users', { name: '1234', age: 44 })
    .then(
        (newKey) => {
            console.log(newKey);
            fb.update_childnodes_database(`users/${newKey}`, { name: '4321' })
                .then(
                    (result) => {
                        console.log(result);
                    });
        });



// Attaches a callback the specified document.
// Listner should mostly be avoided due to the constant callbacks on the data (many read operation).
// Only use listner if necessary.
fb.attach_listner_firestore(
    'clients/test',
    (data: any) => {
        console.log(data);
    });

setTimeout(
    () => {
        for (let i = 0; i < 100; i++) {
            fb.update_doc_firestore('clients/test', { num: i });
        }
    },
    5000);

// Creates a new user.
fb.create_new_user('test@gmail.com', '12341234')
    .then(
        (user) => {
            if (user !== null) {
                console.log(user?.uid);
            }
        });

// Signs in a existing user.
fb.sign_user_in('test@gmail.com', '12341234')
    .then(
        (user) => {
            if (user !== null) {
                console.log(user?.uid);
            }
        });

// Signs out the currently logged in user.
fb.sign_user_out().then(
    (result) => {
        console.log(result);
    });
