package com.quanode.androidexample.BackendManager;

import com.quanode.androidexample.App;
import com.quanode.behaviors.BehaviorCallback;
import com.quanode.behaviors.BehaviorError;


import java.util.Map;

public class Logout {
    private static Logout logout;
    private static Logout.LogoutCallback logoutCallback;
    private Logout() {
    }

    public static Logout getInstance(Logout.LogoutCallback logoutCB) {
        if (logout == null)
            logout = new Logout();
        logoutCallback = logoutCB;
        return logout;
    }

    public void logoutUser() {

        try {
            App.behaviors.getBehaviour(BehaviorsNames.logout).apply(null, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    logoutCallback.logoutCall(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public interface LogoutCallback {
        void logoutCall(Map<String, Object> map, BehaviorError e);
    }
}


