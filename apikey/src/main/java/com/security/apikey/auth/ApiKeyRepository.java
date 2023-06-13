package com.security.apikey.auth;

import org.springframework.data.repository.CrudRepository;

public interface ApiKeyRepository extends CrudRepository<ApiKey, Long> {

    ApiKey findByKey(String key);
}
