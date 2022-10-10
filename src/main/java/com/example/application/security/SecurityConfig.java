package com.example.application.security;

import java.util.Base64;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;

import com.vaadin.flow.spring.security.VaadinWebSecurity;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends VaadinWebSecurity {

    // create file "config/secrests/application.properties"
    // use this command to generate new random secret for your app:
    // openssl rand -base64 32
    @Value("${com.example.application.app.secret}")
    private String appSecret;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);

        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        setStatelessAuthentication(http,
                new SecretKeySpec(Base64.getDecoder().decode(appSecret), JwsAlgorithms.HS256),
                "com.example.application");
        setLoginView(http, "/login", "/");
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web.ignoring().antMatchers("/images/*.png");
        web.ignoring().antMatchers("/icons/*.png");
        // Let our flag SVG icons be public so that login-view.ts can show
        // them before login. Icons are in resources/META-INF/resources folder
        web.ignoring().antMatchers("/icons/*.svg");
    }

    @Bean
    public UserDetailsManager userDetailsService() {
        UserDetails user =
                User.withUsername("user")
                        .password("{noop}user")
                        .roles("USER")
                        .build();
        UserDetails admin =
                User.withUsername("admin")
                        .password("{noop}admin")
                        .roles("ADMIN")
                        .build();
        return new InMemoryUserDetailsManager(user, admin);
    }
}
