package com.quanode.androidexample.BackendManager;


import com.quanode.androidexample.App;
import com.quanode.behaviors.BehaviorCallback;
import com.quanode.behaviors.BehaviorError;

import java.util.HashMap;
import java.util.Map;


public class Login {
    private static Login login;
    private static LoginCallback loginCallback;
    private Login() {
    }

    public static Login getInstance(LoginCallback loginCB) {
        if (login == null)
            login = new Login();
        loginCallback = loginCB;
        return login;
    }

    public void loginWithEmailAndPassword(String email, String password) {

        // login wih backend
        Map<String, Object> map = new HashMap<>();
        map.put("email", email);
        map.put("password", password);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.login).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    loginCallback.loginCall(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public interface LoginCallback {
        void loginCall(Map<String, Object> map, BehaviorError e);
    }
}

