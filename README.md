# CraneOperator
Just as crane operators can see where all the containers are in the shipyard, CraneOp gives you a simple web interface for browsing around a Docker Registry running version 2.0+

[![Circle CI](https://circleci.com/gh/parabuzzle/craneoperator.svg?style=svg)](https://circleci.com/gh/parabuzzle/craneoperator)

```
docker run -d -p 4567:4567 parabuzzle/craneoperator:latest
```

## Customizing the Crane

```
docker run -d \
  -p 4567:4567 \
  -e REGISTRY_HOST=registry.yourdomain.com \
  -e REGISTRY_PORT=443 \
  -e REGISTRY_PROTO=https \
  -e REGISTRY_SSL_VERIFY=false \
  parabuzzle/craneoperator:latest
```


![https://raw.githubusercontent.com/parabuzzle/craneoperator/master/screenshots/image_info.png](https://raw.githubusercontent.com/parabuzzle/craneoperator/master/screenshots/image_info.png)
