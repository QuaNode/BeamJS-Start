package com.quanode.androidexample.BackendManager;


import com.quanode.androidexample.App;
import com.quanode.behaviors.BehaviorCallback;
import com.quanode.behaviors.BehaviorError;

import java.util.HashMap;
import java.util.Map;


public class SignUp {
    private static SignUp signUp;
    private static SignUpCallback signUpCallback;
    private SignUp() {
    }

    public static SignUp getInstance(SignUpCallback sign) {
        if (signUp == null)
            signUp = new SignUp();
        signUpCallback = sign;
        return signUp;
    }
    public void signUpWithEmailAndPassword(String email, String password) {

        Map<String, Object> map = new HashMap<>();
        map.put("email", email);
        map.put("password", password);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.register).apply(map, new BehaviorCallback<Map<String, Object>>() {

                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError behaviorError) {
                    // callback to activity which called this class
                    signUpCallback.signUpCall(stringObjectMap, behaviorError);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public interface SignUpCallback {
        void signUpCall(Map<String, Object> map, BehaviorError e);
    }
}

