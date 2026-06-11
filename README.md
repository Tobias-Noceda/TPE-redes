# The Store

[![Build](https://github.com/jupmoreno/the-store/actions/workflows/main.yml/badge.svg)](https://github.com/jupmoreno/the-store/actions/workflows/main.yml)

**The Store** is a modern e-commerce platform built with microservices architecture.

Our platform provides a complete shopping experience with:

- **Beautiful storefront** with customizable themes and responsive design
- **Scalable microservices** built with multiple languages and frameworks
- **Real-time inventory management** and order processing

## 🏗️ Architecture

The Store is built with a microservices architecture that uses different technologies:

![Architecture](/docs/images/architecture.png)

| Service                  | Language           | Description                                   |
| ------------------------ | ------------------ | --------------------------------------------- |
| [UI](./src/ui/)             | Java (Spring Boot) | Modern web interface with themes and chat bot |
| [Catalog](./src/catalog/)   | Go                 | Product catalog API with search and filtering |
| [Cart](./src/cart/)         | Java (Spring Boot) | Shopping cart management with Redis/DynamoDB  |
| [Orders](./src/orders/)     | Java (Spring Boot) | Order processing and management               |
| [Checkout](./src/checkout/) | Node.js (NestJS)   | Checkout orchestration and payment processing |

## 🛠️ Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) running
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) installed
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed

### Cluster Management

Use the `local.sh` script to manage your local Kubernetes cluster:

```bash
# Create a new cluster and deploy all services
./local.sh create-cluster

# Rebuild the entire cluster (delete and recreate)
./local.sh rebuild-cluster

# Delete the cluster
./local.sh delete-cluster

# Check cluster status
./local.sh status

# Build and load Docker images only
./local.sh reload-images
```

After running `./local.sh create-cluster`, access The Store at: **http://localhost**.

### Testing

#### E2E Testing

Run end-to-end tests to validate the complete system:

```bash
# Run e2e tests on existing cluster
./local.sh e2e-test
```

**Note**: These tests are run automatically when creating or rebuilding the cluster. You can skip them using the `--skip-tests` parameter for faster setup:

```bash
# Create cluster without running tests (faster setup)
./local.sh create-cluster --skip-tests

# Rebuild cluster without running tests
./local.sh rebuild-cluster --skip-tests
```

#### Load Testing

Run load generator tests to validate system performance:

```bash
# Run load generator tests
./local.sh load-test
```

The load generator will run performance tests against your local cluster for 10 minutes (or until manually stopped) to validate system behavior under load.

### Centralized logs management

Logs are handled in the cluster under the sub-domain `logs.localhost` for this reason, to be able to reach the cluster ingress `localhost:80` searching for the host `logs.localhost` this entry should be added to the `/etc/hosts` (`C:\Windows\System32\drivers\etc\hosts` in Windows):

```
127.0.0.1       logs.localhost
```

After that, when accessing `logs.localhost` on your browser, you will see the OpenSearch Dashboard.

#### Indexes and dashboards creation

OpenSearch needs indexes to read logs and be able to understand them so as to apply filters and create dashboards. To create the index you should:

1. Open the side bar in the UI (`logs.localhost`)
2. Go to "Dashboard Management" in the "Management" section.
3. Navigate to: `saved Objects`
4. Press import add the `/dist/logging/opensearch/dashboards/dashs/index-pattern.ndjson`

##### **Dashboards**

1. Repeat de imports for the other 3 `.ndjson` files.
2. Go to side bar in the UI
3. Go to "Dashboard" in "OpenSearch Dashboards" section
4. Choose one of the created dashboards
5. Use filters if needed
6. (Optional) Pin filters and navigate to "Discover" in "OpenSearch Dashboards" section. In the reporting tab in the top-right to create reports in a csv file.

---

**The Store** - Built with ❤️ for modern e-commerce
