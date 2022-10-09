<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area fragment">
Unleashing Protocol Buffers Evolution<br/>
<a style="font-size: 1.1rem;" href="https://github.com/fowles/unleashing-protobuf-evolution">https://github.com/fowles/unleashing-protobuf-evolution</a><br/>
by Matt Kulukundis and Miguel Young de la Sota
</div>

<div style="font-size: 0.8rem; color: white" class="absolute bottom-0">press "S" for speaker view</div>

NOTES:

**SLOW DOWN**

Hi folks, I'm Matt **and I am Miguel**.

*ADVANCE*

Welcome to our talk about protobuf evolution.  This talk is meant to both
motivate and give a sneak peak of upcoming work in the protobuf ecosystem.

*ADVANCE*

---

<!-- .slide: data-background="./snakes.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Python 2 to 3
</div>


NOTES:

**SLOW DOWN**

I guess we should start with what do we mean by evolution.  **Actually Matt,
let's start with something concrete.**

*ADVANCE*

**How about the evolution of python 2 to python 3?**

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

*ADVANCE* The 2to3 tool helped a lot despite its rough edges.

*ADVANCE* **Also, `import __future__` allowed libraries to pre-migrate before
the rest of code was ready.**

*ADVANCE* Right, and the `six` package provided a way to span the divide.  But
even despite all that, the change was just too large to smoothly adjust for.

**Yeah, but the key pattern is obvious.  Things that allow for flexibility and
incrementality in transitions make life easier.**


---

<!-- .slide: data-background="./antikythera.jpg" -->

<div class="area">
Protobuf Evolution<br/>
<ul>
<li>Wire format</li>
<li>Proto language</li>
<li>Generated APIs</li>
</ul>
</div>

NOTES:

**SLOW DOWN**

Let's back up and talk about what we even mean for protobuf evolution though.
This could mean a lot of things, but I think this is a broadly encompassing
list from hardest to easiest.

**But easiest doesn't mean easy!**

Right, so let's go into them.

*ADVANCE*

---

<!-- .slide: data-background="./wire-splices.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Protobuf Wire Format Evolution
</div>

NOTES:

**SLOW DOWN**

The wire format is definitely the hardest thing to evolve.  Because it spans
time in a way that code fundamentally doesn't.  You have two sides of a network
connection, or data written to disk sometime in the nebulous past.

**Fortunately, this format was designed pretty well with respect to evolution of
individual messages.  It has clear rules for adding and removing fields.  You
could imagine adding new tag types.**

Yeah, but that requires updating parsers to accept the new format and wait years
to decades for all existing parsers to roll out updates before serializers can
emit them.  This is the sort of effort that we only want to do one a decade or
so.

**And right now we have our sights elsewhere.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Proto Language Evolution
</div>

NOTES:

**SLOW DOWN**

Language evolution is a bit easier.

*ADVANCE*

You have to update parsers, and if the change modifies descriptor.proto then
you have to update all the code generators as well.  If we want to do this, it
is best if files start with something early on them makes them unparsable to
older versions of the compiler. Also, it is important that the changed proto
language does not require any wire format changes or you are in the previous
situation.

**We should probably explain what descriptor.proto is *::quick explanation of
descriptor.proto as the AST for code generators to interact with::***

**SLOW DOWN**

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Proto Generated API Evolution
</div>

NOTES:

**SLOW DOWN**

Generated API evolution has huge potential to unlock performance wins.  It lets
us fix historical mistakes and replace inefficient designs.

*ADVANCE*

**Unfortunately, we are currently in a worse state then Python 2 to 3.  We don't
have any tools or mechanisms for incremental evolution.**

So the question becomes, how do design the equivalents of `2to3` and `import
__future__` for protobuf languages.


**Actually, we should start with the second step so we can understand where we
are going before we plan the path to get there.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area fragment">
Editions
</div>


NOTES:

**SLOW DOWN**

**What language evolution can we make that will allow us to smoothly migrate
things in the future.**

*ADVANCE*

**To start with we will borrow a concept from `rust` -- language editions.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto
syntax = "proto3";
```
<!-- .element: class="fragment" -->

NOTES:

**SLOW DOWN**

**What language evolution can we make that will allow us smoothly migrate things
in the future.**

*ADVANCE*

**To start with we will borrow a concept from `rust` -- language editions.
Let's take our old trustworthy `syntax` production and give it a shiny new coat.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

```proto
edition = "2023";
```

NOTES:

**SLOW DOWN**

**Now we have something that ticks a bit faster then the full syntax, but that
doesn't really tell us what it does.  In a real sense this simply gives us the
version number of python2 vs python3.  We need something like `import __future__`
to make is useful.  We could make our life even easier if we also had an `import
__past__`.**

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

---

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
slightly more compilicated proto.**

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

**Then we can use features to `import __future__` for this field.  At core here,
is the idea that an `edition` sepecifies a set of defaults for different
`features`, but that a user can override them at either a file or field level.
So when the time comes to upgrade the entire file.**

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

features.(pb.cpp).string_type = STRING;

message Person {
  string name = 1;
  string address = 2;
}
```

NOTES:

**SLOW DOWN**

**Alternately, if all the strings in this file were not ready, we can simply
specify the feature at the top level.**

**As an aside, you may be asking yourselves "what is this syntax?".  This is an
existing syntax in protobuf files for *custom options*.  The only new grammar
production required for this is for the first `edition` line.**

*ADVANCE*

---

<!-- .slide: data-background="./vowel-shift.svg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
Editions and Features
</div>

NOTES:

**SLOW DOWN**

**Using custom options allows each language generator spaces to evolve its own
features independently.  This allows third-party language generators to play on
equal footing with the ones built into `protoc`. Together these give us `import
__future__`, `import __past__`, and a way to know what time it is.  But we still
need a `2to3` tool.**

*ADVANCE*


---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

<div class="area">
Proto Tiller
</div>

NOTES:

**SLOW DOWN**

What if we had a simple tool to automate upgrading of proto files?

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
edition = "2023";

message Person {
  string name = 1
    [features.(pb.cpp).string_type = STRING_VIEW];
  string address = 2;
}
```

NOTES:

**SLOW DOWN**

It would take a file like this and a simple command

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```json
$ prototiller upgrade --edition=2024 person.proto
```

NOTES:

**SLOW DOWN**

and simply import past for you automatically.

*ADVANCE*

---

<!-- .slide: data-background="./gopher-science.jpg" -->
<!-- .slide: data-background-size="contain" -->

```proto []
edition = "2024";

message Person {
  string name = 1;
  string address = 2
    [features.(pb.cpp).string_type = STRING];
}
```

NOTES:

Or even allowed more fine grained control of modifications.

**SLOW DOWN**

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

```proto []
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

Use `--force_unsafe_changes` to apply it anyway.
```

NOTES:

**SLOW DOWN**

With a rich set of primitives, people can evolve their own codebases safely.

*ADVANCE*

---

<!-- .slide: data-background="./time.jpg" -->

<div class="area fragment">
Timeline
</div>

NOTES:

**SLOW DOWN**

Well, this is kinda embarrassing.  

*ADVANCE*

Honestly, this is most a sneak peak of where we are going.  Most of this is
vaporware right now...

**A lot of core design work is done.  We are hoping to start breaking ground on
prototiller any minute now and have early support in parsers and code generators
for editions next year.**

*ADVANCE*

---

<!-- .slide: data-background="./time.jpg" -->

<div class="area fragment">
Questions?
</div>

NOTES:

* REPEAT THE QUESTION
