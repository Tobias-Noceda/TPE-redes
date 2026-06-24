/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.amazon.sample.ui.web.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 * Logs one INFO line per HTTP request so every call this service handles is
 * visible and traceable. The log is emitted within the request's reactive
 * scope, so the OpenTelemetry trace_id/span_id are attached automatically.
 */
@Component
public class RequestLoggingWebFilter implements WebFilter {

  private static final Logger log = LoggerFactory.getLogger(
    RequestLoggingWebFilter.class
  );

  @Override
  public Mono<Void> filter(
    ServerWebExchange exchange,
    WebFilterChain chain
  ) {
    long start = System.currentTimeMillis();
    return chain
      .filter(exchange)
      .doFinally(signal -> {
        HttpStatusCode status = exchange.getResponse().getStatusCode();
        log.info(
          "{} {} {} {}ms",
          exchange.getRequest().getMethod(),
          exchange.getRequest().getPath().value(),
          status != null ? status.value() : 0,
          System.currentTimeMillis() - start
        );
      });
  }
}
