# Device Filter Classification Report

This project uses OpenRouter Decisions to turn a user's device description into
structured device filters. Questions use the `noul` response type and may enable
multiple categories and multiple values within each category.

This report describes the latest evaluation in
[`classification-results.csv`](./classification-results.csv), generated on
September 26, 2026. The suite contains 20 device descriptions ranging from a
single requirement to complex devices with values across most categories.

## Evaluation policy

Each test case provides a description and a list of expected fields.

- `PASS`: an expected field was enabled.
- `MISSING`: a stated expected field was not enabled.
- `EXTRA`: an additional field was enabled. Extras do not automatically fail a
  case because they may be useful or defensible suggestions.
- `ERROR`: classification could not be completed.

Each CSV row also includes `duration_ms`, the end-to-end classification time for
its test case. It starts immediately before category classification and ends
after all field answers have been received. Because a test case can produce
multiple rows, its duration is repeated on each of those rows.

`case_passed` is intentionally strict: every expected field must be present. For
the intended product, expected-field coverage is more representative than the
perfect-case rate. A device with 13 of 14 useful filters is still a useful
classification even though its strict case result is false.

## Latest results

| Metric                                                   |          Result |
| -------------------------------------------------------- | --------------: |
| Test cases                                               |              20 |
| Perfect cases                                            |    6/20 (30.0%) |
| Expected fields found                                    | 198/226 (87.6%) |
| Missing expected fields                                  |              28 |
| Additional fields                                        |               6 |
| Request errors                                           |               0 |
| Average request time                                     |          915 ms |
| Approximate precision if every extra is considered wrong |           97.1% |

The average case contains 11.3 expected fields. Requiring every field to pass
makes the perfect-case metric compound errors across large descriptions. The
30% perfect-case result therefore does not mean that only 30% of filters were
classified correctly.

## Results by category

| Category             | Found | Expected | Recall |
| -------------------- | ----: | -------: | -----: |
| Bluetooth            |    16 |       17 |  94.1% |
| Network technologies |    49 |       49 | 100.0% |
| 3GPP features        |     8 |        8 | 100.0% |
| Use cases            |    71 |       78 |  91.0% |
| Wi-Fi type           |    14 |       16 |  87.5% |
| Verticals            |    19 |       23 |  82.6% |
| eSIM                 |     5 |        7 |  71.4% |
| Form factors         |     6 |        9 |  66.7% |
| Device types         |    10 |       19 |  52.6% |

Network technologies and 3GPP releases were fully recovered. Device types are
the main weakness, particularly composite labels such as `Module & Chipset`,
`Gateway & Dongles`, and `Handhelds & Wearables`.

## Saved evaluation history

- [`old_tests.csv`](./old_tests.csv): original prompt and threshold baseline.
- [`strict_prompt_tests.csv`](./strict_prompt_tests.csv): strict field prompt at
  the original field threshold.
- [`threshold_075_tests.csv`](./threshold_075_tests.csv): strict prompt with the
  0.75 field threshold on the earlier, smaller suite.
- [`single_request_results.csv`](./single_request_results.csv): preserved
  single-request baseline from before the timing-enabled run.
- [`classification-results.csv`](./classification-results.csv): latest expanded
  multi-field suite.

## Experiment outcome

The classifier recovered 87.6% of expected filters with 97.1% approximate
precision, no request errors, and a 915 ms average response time. It is already
useful for filter suggestions, while device types and other composite labels
remain the clearest opportunity for improvement.
