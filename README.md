# unoconv-worker

[![Build Status](https://travis-ci.org/flux-s/unoconv-worker.svg)](https://travis-ci.org/flux-s/unoconv-worker)

*A docker image containing a very simple REST service for document conversion using unoconv.*

This is mostly intended as a worker for [flux-templating](https://github.com/flux-s/flux-templating) but can be used independently.

The core issue that we try to solve is that libreoffice is not built to run document conversions in parallel (see [related unoconv issue](https://github.com/dagwieers/unoconv/issues/225)).

Our solution:
  - Building worker containers that contain instances of libreoffice available to perform conversions.
  - Exposing a simple streaming API that simulates concurrency but internally buffers the tasks if necessary.
