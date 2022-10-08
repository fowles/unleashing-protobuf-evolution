<!-- .slide: data-background="./antikythera.jpg" -->
<!-- .slide: data-background-size="105%" -->

<div class="background" style="border-radius: 10px">
  <h4 style="margin-bottom: 0;">Unleashing Protocol Buffers Evolution</h4>
  <a style="font-size: 1.1rem;" href="https://github.com/fowles/unleashing-protobuf-evolution">https://github.com/fowles/unleashing-protobuf-evolution</a>
  <h5>by Matt Kulukundis and Miguel Young de la Sota</h5>
</div>
<div style="font-size: 0.8rem; color: white" class="absolute bottom-0">press "S" for speaker view</div>

NOTES:

* SLOW DOWN

---

Python 2->3

NOTES:

* SLOW DOWN
* Why was this even attempted in the first place? (e.g. is change good, in the abstract?)
* 2to3 tool helped
* import future helped
* still too large a bite to swallow easily

---

Incrementality is the key

NOTES:

* SLOW DOWN

---

Protobuf Evolution
* Wire format
* Proto language
* API

NOTES:

* SLOW DOWN
* What do we mean when we say protobuf evoltion
* Potentially many things, here are some of them from hardest to easiest
* Easiest doesn't mean easy!

---

Protobuf Wire Format Evolution

NOTES:

* SLOW DOWN
* Existing rules for adding/removing fields (good well scoped, battle tested)
* Novel tag types (bad scary)
* Sketch of the decade long efforts required here

---

Proto Language Evolution

NOTES:

* SLOW DOWN
* Requires updating all parsers and code generators
* Data at rest/over the network/should work both ways (or this is a wire format break)
* Sketch of how this is measured in years

---

Proto Generated API Evolution

NOTES:

* SLOW DOWN
* Currently only allowed as a major break; same problems as Python!
* proto2->proto3 doesn’t exist (and proto3 wasn't designed with it in mind).
* Proto Import future doesn’t exist!
* How do we cut up our food so we can take smaller bites?

---

Evolve the Proto Language

NOTES:

* SLOW DOWN
* Hopefully we only have to do this once, by installing explicitly evolution into the schema

---

Editions!

NOTES:

* SLOW DOWN
* Needs to provide a concept of incrementality

---

Features!

NOTES:

* SLOW DOWN
* Need to separate language bindings to avoid a centralized choke point

---

Per Language Features!

NOTES:

* SLOW DOWN
* Sketch of using this for a single evolution
* switching from const std::string& to std::string_view
* why would you want it?
* Modern, more flexible C++ type.
* Enables memory-saving optimizations we can't do right now.
* how would you implement it?
* features.(pb.cpp).string_field_type
* how would you deploy it?
* incrementally!

---

Incremental deployment, you say?!

NOTES:

* SLOW DOWN

---

prototiller – our 2to3 tool on steroids

NOTES:

* SLOW DOWN

---

features – a way to import future

NOTES:

* SLOW DOWN

---

editions – how you know the future has arrived

NOTES:

* SLOW DOWN
* tests! – you have tests right?
* Yeah, but you have a monorepo.  What about folks in the real world?
* stick with an edition for many years
* upgrade as you need new features

---

Timeline

NOTES:

* SLOW DOWN
* Well, this is kinda embarrassing, vaporware right now?
* A lot of core design work is done, next up is prototiller and protoc support

---

Questions?

NOTES:

* REPEAT THE QUESTION
