function set_index(tag, timestamp, record)

    local ns = "unknown"
    local svc = "unknown"
    local log_type = "app"

    if record["kubernetes"] ~= nil then

        -- 1. namespace (base de auditoría)
        ns = record["kubernetes"]["namespace_name"] or "unknown"

        local labels = record["kubernetes"]["labels"]

        -- 2. SERVICE (normalización robusta)
        if labels ~= nil then
            svc =
                labels["app.kubernetes.io/name"] or
                labels["app"] or
                labels["k8s-app"] or
                record["kubernetes"]["container_name"] or
                "unknown"
        else
            svc = record["kubernetes"]["container_name"] or "unknown"
        end

        -- 3. LOG TYPE (clasificación de sistema)
        if ns == "kube-system" then
            log_type = "system"
        elseif ns == "logging" then
            log_type = "infra"
        else
            log_type = "app"
        end
    end

    -- =========================
    -- CAMPOS UNIFICADOS (CLAVE)
    -- =========================

    record["service"] = svc
    record["namespace"] = ns
    record["log_type"] = log_type

    -- =========================
    -- ÍNDICE (RECUPERACIÓN LOGS)
    -- =========================

    record["opensearch_index"] = "logs-" .. ns .. "-" .. svc

    return 1, timestamp, record
end