# CraneOperator
Just as crane operators can see where all the containers are in the shipyard, CraneOp gives you a simple web interface for browsing around a Docker Registry running version 2.0+

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


![https://raw.githubusercontent.com/parabuzzle/craneoperator/master/screenshots/Crane_Operator.png](https://raw.githubusercontent.com/parabuzzle/craneoperator/master/screenshots/Crane_Operator.png)
