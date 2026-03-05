# Educational Use

## Scenario

Instructors and students often need to validate Go snippets quickly without the overhead of full project scaffolding.

## How RighToGo helps

- Reduces setup steps.
- Keeps focus on concepts (loops, structs, concurrency, etc.).
- Preserves terminal interaction for input-driven exercises.

## Quick lab flow

1. Student creates `exercise.go` with `package main`.
2. Runs with Play.
3. Iterates quickly until expected output is reached.

## Example script

```go
package main

import "fmt"

func main() {
    var n int
    fmt.Print("Type a number: ")
    fmt.Scanln(&n)
    fmt.Printf("Double: %d\n", n*2)
}
```

## Outcome

Less time spent on setup, more time on practical learning.
