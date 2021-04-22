package com.quanode.androidexample.BackendManager;

import com.quanode.androidexample.App;
import com.quanode.behaviors.BehaviorCallback;
import com.quanode.behaviors.BehaviorError;

import java.util.Map;


public class GetUser {

    private static GetUser getUser;
    private static GetUser.GetUserCallback getUserCallback;
    private GetUser() {
    }

    public static GetUser getInstance(GetUser.GetUserCallback getUserCB) {
        if (getUser == null)
            getUser = new GetUser();
        getUserCallback = getUserCB;
        return getUser;
    }

    public void getUser() {

        try {
            App.behaviors.getBehaviour(BehaviorsNames.getUser).apply(null, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    getUserCallback.getUserCallBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public interface GetUserCallback {
        void getUserCallBack(Map<String, Object> map, BehaviorError e);
    }
}

