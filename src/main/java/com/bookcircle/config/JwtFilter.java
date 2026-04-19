package com.bookcircle.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                                    throws ServletException, IOException {
            // Get Authorization header
            String header = request.getHeader("Authorization");

            // Check header format
            String token = null;
            String email = null;
            if(header!=null && header.startsWith("Bearer "))
            {
                token = header.substring(7);
                email = JwtUtil.extractEmail(token); //no need of import JwtUtil due to file in same package
            }

            // If token valid → set authentication
            if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null) 
            {
                UsernamePasswordAuthenticationToken authtoken = new UsernamePasswordAuthenticationToken(
                    email,        // principal (user)
                    null,         // credentials
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
                );

                SecurityContextHolder.getContext().setAuthentication(authtoken);
            }

            //continue request
            filterChain.doFilter(request, response);
    }
}
