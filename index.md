<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area fragment">
Unleashing Protocol Buffers Evolution<br/>
<a style="font-size: 1.1rem;" href="https://github.com/fowles/unleashing-protobuf-evolution">https://github.com/fowles/unleashing-protobuf-evolution</a><br/>
by Matt Kulukundis and Mike Kruskal
</div>

<div style="font-size: 0.8rem; color: white" class="absolute bottom-0">press "S" for speaker view</div>

NOTES:

**SLOW DOWN**

Hi folks, I'm Matt **and I'm Mike**.

*ADVANCE*

Welcome to our talk about protobuf evolution.  This talk is meant to both
motivate and give a sneak peak of upcoming work in the protobuf ecosystem.
Evolution for protobufs are a highly multidimensional thing, so we will try to
split apart the dimensions a bit.

*ADVANCE*

-----
<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area">
<pre><code class="graph"><script type="text/template">
digraph g {
  bgcolor = "transparent";
  rankdir=LR;
  node [
    fontname = "courier";
    shape = none;
  ];
  Disk [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Disk</td></tr>
      </table>
    >;
  ];
  Server [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Server</td></tr>
      </table>
    >;
  ];
  Client [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Client</td></tr>
      </table>
    >;
  ];
  Disk -> Server [dir="both"];
  Server -> Client [dir="both"];
}
</script></code></pre>
</div>

NOTES:

**SLOW DOWN**

Consider a very basic system.  What are the entitites that can evolve here?

*ADVANCE*

---
<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area">
<pre><code class="graph"><script type="text/template">
digraph g {
  bgcolor = "transparent";
  rankdir=LR;
  node [
    fontname = "courier";
    shape = none;
  ];
  Disk [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Disk v0</td></tr>
        <tr><td port="v1">Disk v1</td></tr>
        <tr><td port="v2">Disk v2</td></tr>
      </table>
    >;
  ];
  Server [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Server v0</td></tr>
        <tr><td port="v1">Server v1</td></tr>
        <tr><td port="v2">Server v2</td></tr>
      </table>
    >;
  ];
  Client [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Client v0</td></tr>
        <tr><td port="v1">Client v1</td></tr>
      </table>
    >;
  ];
  Disk:v0 -> Server:v0 [dir="both"];
  Disk:v2 -> Server:v1 [dir="both"];
  Server:v2 -> Client:v0 [dir="both"];
}
</script></code></pre>
</div>

NOTES:

**SLOW DOWN**

We can evolve all of these pieces independently. This is the kind of evolution
that protobuf was designed for. Adding fields, marking old fields as reserved,
handling of unknown fields.  This is the bread and butter of the protobuf
ecosystem.

**Those little wires between boxes.  Those are the protobuf wire format.  Let's
walk though a basic example of *Schema Evolution*.**

*ADVANCE*

---
<!-- .slide: data-background="./wire-splices.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
message Person {
  string name = 1;
}
```
<!-- .element: class="fragment" -->

```
00000000: 0a17 4d61 7474 6865  ..Matthe
00000008: 7720 466f 776c 6573  w Fowles
00000010: 204b 756c 756b 756e   Kulukun
00000018: 6469 73              dis
```
<!-- .element: class="fragment" -->

NOTES:

**SLOW DOWN**

**We can start with a simple message**

*ADVANCE*

**along with the wire format that someone might get from it.  The first byte
`0A` indicates field 1 has length encoded content.  The second byte `17` is the
length of the string field.  Rather then inflict too much more binary on you
though, I am going to switch to protoscope's notation.  Protoscope is a tool
for decoding protobuf wireformat in a slightly nicer way.**

*ADVANCE*

---
<!-- .slide: data-background="./wire-splices.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
message Person {
  string name = 1;
}
```

``` [2]
# github.com/protocolbuffers/protoscope
1: {"Matthew Kulukundis"}
```

NOTES:

**SLOW DOWN**

**Now imagine the client had a newer schema for person that included an address
field.**

*ADVANCE*

---
<!-- .slide: data-background="./wire-splices.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
message Person {
  string name = 1;
  string address = 2;
}
```

``` [2,3]
# github.com/protocolbuffers/protoscope
1: {"Matthew Kulukundis"}
2: {"New York, NY"}
```

NOTES:

**SLOW DOWN**

**When this message comes to an old version of the server it will see something
like.**

*ADVANCE*

---
<!-- .slide: data-background="./wire-splices.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto [1,2,4]
message Person {
  string name = 1;
  string address = 2;
}
```

``` [2,3]
# github.com/protocolbuffers/protoscope
1: {"Matthew Kulukundis"}
2: {"New York, NY"}
```

NOTES:

**SLOW DOWN**

**Fortunately, protobuf has semantics for unknown fields baked into it.  Schema
evolution has been planned for from the beginning and is thus handled
smoothly.**

You could imagine adding new tag types. But that requires updating parsers to
accept the new format and waiting years to decades for all existing parsers to
roll out updates before serializers can emit them.  This is the sort of effort
that we only want to do once a decade.  But we are focused neither on Schema
Message Evolution (which is well handled) nor on Wire Format Evolution.  We are
focused on API evolution.

*ADVANCE*

---
<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area">
<pre><code class="graph"><script type="text/template">
digraph g {
  bgcolor = "transparent";
  rankdir=LR;
  node [
    fontname = "courier";
    shape = none;
  ];
  Server [
    fontsize=30;
    label=<
      <table border="0" cellborder="1" cellspacing="0" cellpadding="4">
        <tr><td port="v0">Server v0</td></tr>
        <tr><td port="v1">Server v1</td></tr>
        <tr><td port="v2">Server v2</td></tr>
      </table>
    >;
  ];
}
</script></code></pre>
</div>

NOTES:

**SLOW DOWN**

Consider the evolution of one componenet, a single piece of software.  Adding
features, upgrading libraries, updating language versions.  All the things that
go into a single piece of software.

Notably protobuf has strong primitives for the first type of evolution but has
zero primitives for the second type.  Any update to the generated APIs of
protobuf must be entirely atomic for a project. Of course, upgrading languages
should be hard and there is nothing to be done about it.

*ADVANCE*

-----
<!-- .slide: data-background="./citation.png" -->
<!-- .slide: data-background-size="contain" -->

NOTES:

**SLOW DOWN**

**Actually Matt, maybe we can look at some specific ones to see if they give us
ideas.**

*ADVANCE*

---

<!-- .slide: data-background="./snakes.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Python 2 to 3
</div>


NOTES:

**SLOW DOWN**

**What about the evolution of python 2 to python 3?**

*ADVANCE*

Sure, that was a painful transition, but I think there are some good points we
can learn from.

*ADVANCE*

---

<!-- .slide: data-background="./snakes.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
Python 2 to 3<br/>
<ul>
<li class="fragment"><code>2to3</code> tool</li>
<li class="fragment"><code>import __future__</code></li>
<li class="fragment">The <code>six<code> package</li>
</ul>
</div>

NOTES:

**SLOW DOWN**

Sure, that was a painful transition, but I think there are some good points we
can learn from.

*ADVANCE*

The `2to3` tool helped a lot despite its rough edges.

*ADVANCE*

**`import __future__` allowed libraries to pre-migrate before
the rest of code was ready.**

*ADVANCE*

The `six` package provided a way to span the divide.  But
even despite all that, the change was just too large to smoothly incorporate
into large systems.

**Yeah, but the key pattern is obvious.  Things that allow for flexibility and
more incremental migrations make life easier.**

*ADVANCE*

-----

<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area">
Protobuf Evolution<br/>
<ul>
<li><strike>Wire format</strike></li>
<li>Proto language</li>
<li>Generated APIs</li>
</ul>
</div>

NOTES:

**SLOW DOWN**

Generated API evolution has huge potential to unlock performance wins.  It lets
us fix historical mistakes and replace inefficient designs.  This is the target
we are actually aiming for.  How do we apply the lessons from python 2 to 3 to
this problem?

So how do we apply this concept to protobuf?  What we want is to powerful
primitives to enable evolution of generated APIs. But, we are currently in a
worse state then Python 2 to 3.  We don't have any tools or mechanisms for
incremental evolution.

**So the question becomes, how do we create the equivalents of `2to3` and
`import __future__` for protobuf.  How do we evolve the schema language defining
`.proto` files, so it provides rich primitives for API evolution.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Editions
</div>

NOTES:

**SLOW DOWN**

**Fortunately, language evolution is way simpler than wire format evolution.**

**You have to update parsers, and if the change modifies semantics in any
meaningful way, then you have to update all the code generators as well. Also,
it is important that the changed proto language does not require any wire format
changes or you are back in the situation we mentioned earlier.**

*ADVANCE*

**To start with we will borrow a concept from the `rust` language called *editions*.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto
syntax = "proto3";
```

NOTES:

**SLOW DOWN**

**Before diving into editions though, we need to understand what `syntax =
"proto2"` and `syntax = "proto3"` mean.  Each of these indicates a big bundle of
immutable configuration switches.  There is nothing incremental between them.  There is no
control over the switches directly.  No one had a migration plan for `proto2` to
`proto3`.**

**This rigidity is one of our major problems.  Instead we will pivot to *editions*.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto
edition = "2023";
```

NOTES:

**SLOW DOWN**

**Rather than immutable configuration, an edition is a set of defaults that can
be overriden.   We call each of these configurable things *features*.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
Editions and <b>Features</b>
</div>

NOTES:

**SLOW DOWN**

**Features are the mechanism to provide us both `import __future__` and `import
__past__` incrementally.  This will probably be easier to explain if we look at
a concrete example.**

*ADVANCE*

-----

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
message Person {
  string name = 1;
}
```
<!-- .element: class="fragment" -->

NOTES:

**SLOW DOWN**

We are currently in a bit of a knot around strings.

*ADVANCE*

Consider this message and the C++ that it generates.

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```cc [|4]
class Person : public Message {
 public:
  const std::string& get_name() const;
  void set_name(const std::string& name);
}
```

NOTES:

**SLOW DOWN**

For those loosely familiar with C++, this doesn't seem so bad, but it has two
important shortcomings.

*ADVANCE*

This setter means that a caller must have a `std::string`.  There are relatively
easy migrations that allow us to change this to use a `std::string_view`.

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```cc [4|3]
class Person : public Message {
 public:
  const std::string& get_name() const;
  void set_name(std::string_view name);
}
```

NOTES:

**SLOW DOWN**

In fact, we have already done those as they don't officially break the API.

*ADVANCE*

This accessor, on the other hand, means that a `std::string` must exist inside
the representation of `Person`. As a result, we are highly constrained in how we
can implement `Person`.  What if we knew from runtime data that `name` was
always between 3 and 14 bytes? Then we are wasting spacing by having a
`std::string`!

If instead we returned an opaque handle to the data,

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```cc [3]
class Person : public Message {
 public:
  std::string_view get_name() const;
  void set_name(std::string_view name);
}
```

NOTES:

**SLOW DOWN**

Then we could apply a variety of optimizations internally:  like custom memory
sizing, storing as a pascal string, or avoiding `std::string` destructors
entirely.  So how do we use *features* to help us get there?

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
message Person {
  string name = 1;
}
```

NOTES:

**SLOW DOWN**

**To start out we can make it explicit what edition we are on and consider a
slightly more complicated proto.**

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
edition = "2023";

message Person {
  string name = 1;
  string address = 2;
}
```

NOTES:

**SLOW DOWN**

**Now we can use features to `import __future__` for a single field.**

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto [1,4-5]
edition = "2023";

message Person {
  string name = 1
    [features.(pb.cpp).string_type = STRING_VIEW];
  string address = 2;
}
```

NOTES:

**SLOW DOWN**

**The core idea here, is that an `edition` specifies a set of defaults for
different `features`, but that a user can override them at either a file or
field level. So when the time comes to upgrade the entire file.**

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto [1,5-6]
edition = "2024";

message Person {
  string name = 1;
  string address = 2
    [features.(pb.cpp).string_type = STRING];
}
```

NOTES:

**SLOW DOWN**

**You can `import __past__` for the parts that aren't ready yet.**

*ADVANCE*

---

<!-- .slide: data-background="./gcl.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto [1,3]
edition = "2024";

option features.(pb.cpp).string_type = STRING;

message Person {
  string name = 1;
  string address = 2;
}
```

NOTES:

**SLOW DOWN**

**Alternately, if all the strings in this file were not ready, we can simply
specify the feature at the top level.**

**As an aside, you may be asking yourselves "what is this syntax we're using?".  This is a
pre-existing syntax in protobuf files for *custom options*.  The only changes to the protobuf
grammar required for this are for the first `edition` line.**

*ADVANCE*

-----

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
Editions and Features
</div>

NOTES:

**SLOW DOWN**

**Using custom options allows each language generator space to evolve its own
features independently.  This allows third-party language generators to play on
equal footing with the ones built into `protoc`. Together these give us `import
__future__`, `import __past__`, and a way to know what time it is.  But we still
need a `2to3` tool.**

*ADVANCE*


-----

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
<code>prototiller</code>
</div>

NOTES:

**SLOW DOWN**

What if we had a simple tool to automate upgrading of proto files?

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```json
$ prototiller upgrade --edition=2024 person.proto
```

NOTES:

**SLOW DOWN**

It would take a single command and would update a file for you automatically,
adding `import __past__` and removing `import __future__` as needed.

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto [1,4-5]
edition = "2023";

message Person {
  string name = 1
    [features.(pb.cpp).string_type = STRING_VIEW];
  string address = 2;
}
```
```json
$ prototiller upgrade --edition=2024 person.proto
```
```proto [1,5-6]
edition = "2024";

message Person {
  string name = 1;
  string address = 2
    [features.(pb.cpp).string_type = STRING];
}
```

NOTES:

**SLOW DOWN**

Or we could allowed more fine grained control of modifications.

*ADVANCE*


---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```json
$ cat change.spec
actions {
  remove_field {
    fully_qualified_name: "Person.address"
    reserve_number: true
    reserve_name: false
  }
}
$ prototiller change person.proto --spec=change.spec
```

NOTES:

**SLOW DOWN**

With a rich set of primitives, people can evolve their own codebases safely.

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto [5]
edition = "2024";

message Person {
  string name = 1;
  string address = 2;
}
```

```json
$ prototiller change person.proto --spec=change.spec
```

```proto [5]
edition = "2024";

message Person {
  string name = 1;
  reserved 2;
}
```

NOTES:

but we can take it a step further and encode smarts into the tool

**SLOW DOWN**

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```json
$ cat change.spec
actions {
  change_type {
    fully_qualified_name: "Person.address"
    new_type: "int32"
  }
}
$ prototiller change person.proto --spec=change.spec
ERROR: changing `Person.address` from `string` to `int32`
breaks wire format compatibility of the message `Person`.

Use `--allow_unsafe_changes` to apply it anyway.
```

NOTES:

**SLOW DOWN**

By making the tool aware of protobuf semantics, we can teach it how to ensure
that the edits it makes are safe from multiple perspectives.  Safe from a wire
format evolution perspective, or no-ops from a generated code perspective.

We hope that this tool will provide a baseline capability for the protobuf
ecosystem that has value far beyond simply updating to the latest edition.

**All this sounds great, but when can I use it?**

*ADVANCE*

-----

<!-- .slide: data-background="./time.jpg" -->

<div class="area fragment">
Questions?
</div>

NOTES:

**SLOW DOWN**

Well, this is kinda embarrassing.  Honestly, this is most a sneak peak of where
we are going.  Most of this is vaporware right now...

**Most of the core design work is done.  We've already started implementing
these and hope to release prototiller this year.  Early support in
parsers and code generators for editions should be ready next year.**

*ADVANCE*

REPEAT THE QUESTION

