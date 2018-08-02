package com.quanode.androidexample.BackendManager;

import com.quanode.androidexample.App;
import com.quanode.behaviors.BehaviorCallback;
import com.quanode.behaviors.BehaviorError;

import java.util.HashMap;
import java.util.Map;

public class X {

    private X.CallBack xCallBack;
    public X(X.CallBack callBack) {

        this.xCallBack = callBack;
    }
    public void add(String name, String workingDays) {

        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("working_days", workingDays);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.addX).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    xCallBack.callBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void delete(String id) {

        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.deleteX).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    xCallBack.callBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void get(String id) {

        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.getX).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    xCallBack.callBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void search(String name) {

        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.searchX).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    xCallBack.callBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void update(String name, String workingDays) {

        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("working_days", workingDays);
        try {
            App.behaviors.getBehaviour(BehaviorsNames.updateX).apply(map, new BehaviorCallback<Map<String, Object>>() {
                @Override
                public void callback(Map<String, Object> stringObjectMap, BehaviorError e) {
                    // callback to activity which called this class
                    xCallBack.callBack(stringObjectMap, e);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    public interface CallBack {
        void callBack(Map<String, Object> map, BehaviorError e);
    }
}
