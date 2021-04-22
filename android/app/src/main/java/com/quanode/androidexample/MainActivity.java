package com.quanode.androidexample;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

import com.quanode.androidexample.BackendManager.SignUp;
import com.quanode.behaviors.BehaviorError;

import java.util.Map;

public class MainActivity extends AppCompatActivity implements SignUp.SignUpCallback{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SignUp signUp = SignUp.getInstance(this);
        signUp.signUpWithEmailAndPassword("asd@gmail.com", "0123456789");
    }

    @Override
    public void signUpCall(Map<String, Object> map, BehaviorError e) {

        Toast.makeText(this, map.get("email")+"", Toast.LENGTH_LONG).show();
        // map.get("name");
        //map.get("authenticated");
        //map.get("id");
    }
}
