package com.quanode.androidexample;

import android.app.Application;

import com.quanode.behaviors.Behaviors;
import com.quanode.behaviors.ExceptionCallback;


public class App extends Application {

    public static Behaviors behaviors;

    @Override
    public void onCreate() {
        super.onCreate();

        try {
               behaviors = new Behaviors("http://10.0.2.2:8383/api/v1",null, this,
                       new ExceptionCallback() {

                   @Override
                   public void callback(Exception e) {

                   }
               });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
