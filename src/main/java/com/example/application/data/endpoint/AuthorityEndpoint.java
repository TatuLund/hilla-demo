package com.example.application.data.endpoint;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;

@BrowserCallable
public class AuthorityEndpoint {
    
    @AnonymousAllowed
    @Nonnull
    public List<String> checkAuthority() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());
    }
}
