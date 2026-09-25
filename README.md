# Device Filter Classification Report

This project uses OpenRouter Decisions to turn a user's device description into
structured device filters. Questions use the `noul` response type and may enable
multiple categories and multiple values within each category.

This report describes the latest evaluation in
[`classification-results.csv`](./classification-results.csv), generated on
September 25, 2026. The suite contains 20 device descriptions ranging from a
single requirement to complex devices with values across most categories.

## Evaluation policy

Each test case provides a description and a list of expected fields.

- `PASS`: an expected field was enabled.
- `MISSING`: a stated expected field was not enabled.
- `EXTRA`: an additional field was enabled. Extras do not automatically fail a
  case because they may be useful or defensible suggestions.
- `ERROR`: classification could not be completed.

`case_passed` is intentionally strict: every expected field must be present.
For the intended product, expected-field coverage is more representative than
the perfect-case rate. A device with 13 of 14 useful filters is still a useful
classification even though its strict case result is false.

## Latest results

| Metric | Result |
|---|---:|
| Test cases | 20 |
| Perfect cases | 6/20 (30.0%) |
| Expected fields found | 199/226 (88.1%) |
| Missing expected fields | 27 |
| Additional fields | 6 |
| Request errors | 0 |
| Approximate precision if every extra is considered wrong | 97.1% |
| Approximate F1 under that same assumption | 92.4% |

The average case contains 11.3 expected fields. Requiring every field to pass
makes the perfect-case metric compound errors across large descriptions. The
30% perfect-case result therefore does not mean that only 30% of filters were
classified correctly.

## Results by category

| Category | Found | Expected | Recall |
|---|---:|---:|---:|
| Bluetooth | 17 | 17 | 100.0% |
| Network technologies | 49 | 49 | 100.0% |
| 3GPP features | 8 | 8 | 100.0% |
| Use cases | 71 | 78 | 91.0% |
| Wi-Fi type | 14 | 16 | 87.5% |
| Verticals | 19 | 23 | 82.6% |
| eSIM | 5 | 7 | 71.4% |
| Form factors | 6 | 9 | 66.7% |
| Device types | 10 | 19 | 52.6% |

Bluetooth, network technologies, and 3GPP releases were fully recovered.
Device types are the main weakness, particularly composite labels such as
`Module & Chipset`, `Gateway & Dongles`, and `Handhelds & Wearables`.

## Coverage by device

| Test case | Found | Expected | Coverage | Missing |
|---|---:|---:|---:|---:|
| `wifi-only-module` | 1 | 1 | 100.0% | 0 |
| `dual-wireless-device` | 3 | 3 | 100.0% | 0 |
| `consumer-5g-smartphone` | 9 | 12 | 75.0% | 3 |
| `industrial-iot-sensor` | 13 | 14 | 92.9% | 1 |
| `agriculture-gateway` | 11 | 12 | 91.7% | 1 |
| `healthcare-wearable` | 13 | 13 | 100.0% | 0 |
| `autonomous-fleet-vehicle` | 11 | 11 | 100.0% | 0 |
| `smart-city-camera` | 11 | 12 | 91.7% | 1 |
| `cold-chain-tracker` | 10 | 11 | 90.9% | 1 |
| `factory-robot` | 11 | 11 | 100.0% | 0 |
| `railway-mounted-unit` | 11 | 12 | 91.7% | 1 |
| `hazardous-oil-gas-device` | 9 | 11 | 81.8% | 2 |
| `public-safety-handheld` | 13 | 15 | 86.7% | 2 |
| `media-streaming-tablet` | 10 | 12 | 83.3% | 2 |
| `utilities-meter` | 10 | 12 | 83.3% | 2 |
| `smart-building-security` | 9 | 11 | 81.8% | 2 |
| `mining-safety-wearable` | 12 | 12 | 100.0% | 0 |
| `airport-logistics-scanner` | 10 | 12 | 83.3% | 2 |
| `multi-network-development-kit` | 11 | 16 | 68.8% | 5 |
| `legacy-featurephone` | 11 | 13 | 84.6% | 2 |

Six cases were perfect, eleven missed at most one field, and eighteen missed at
most two fields. The two main outliers were `consumer-5g-smartphone` and
`multi-network-development-kit`.

## Category selection and field selection

Seven expected fields were not evaluated because their parent category did not
pass the category threshold. Category-stage recall was therefore 219/226, or
96.9%. The other 20 missing expectations reached field classification but did
not pass the field threshold.

The largest field-stage weakness appeared when a description explicitly
requested several values from the same category. For example,
`multi-network-development-kit` missed explicit Wi-Fi and eSIM values while
correctly identifying most of its other requirements. Field questions should
state that multiple values in one category can independently be true.

## Additional selections

Only six additional fields were enabled:

| Test case | Additional field | Confidence |
|---|---|---:|
| `industrial-iot-sensor` | Bluetooth 5.2 | 0.95 |
| `cold-chain-tracker` | Bluetooth 5.1 | 0.94 |
| `railway-mounted-unit` | Maintenance | 0.78 |
| `smart-building-security` | Security | 0.81 |
| `mining-safety-wearable` | Bluetooth 5.2 | 0.94 |
| `airport-logistics-scanner` | Transportation & Logistics | 0.88 |

These selections are semantically defensible. For example, Bluetooth LE 5.2
implies Bluetooth 5.2 capability, and rail infrastructure maintenance implies
maintenance. They should be reviewed as suggestions rather than treated as
automatic failures.

## Interpretation

The classifier is already useful for automatically populating device filters:

- It recovered 88.1% of stated expected fields.
- It generated very few unrelated suggestions.
- It completed all requests without errors.
- Most imperfect devices were missing only one or two fields.

The best next improvements are targeted rather than a broad threshold change:

1. Explicitly tell every field question that multiple values in the same
   category may be selected independently.
2. Add direct aliases for common device-type terms such as `module`, `gateway`,
   `handheld`, `sensor`, and `vehicle-mounted`.
3. Review expectations that are more specific than their source descriptions,
   such as mapping a generic emergency alarm to a distress-button alarm.
4. Continue reporting field coverage alongside strict perfect-case results.

## Running the project

Interactive classification:

```bash
deno task start
```

Run the 20-case evaluation and generate a new `classification-results.csv`:

```bash
deno task test
```

Both commands require `OPENROUTER_API_KEY` in the environment. The test task
writes its CSV incrementally after each case so completed results survive an
interrupted run.

## Saved evaluation history

- [`old_tests.csv`](./old_tests.csv): original prompt and threshold baseline.
- [`strict_prompt_tests.csv`](./strict_prompt_tests.csv): strict field prompt at
  the original field threshold.
- [`threshold_075_tests.csv`](./threshold_075_tests.csv): strict prompt with the
  0.75 field threshold on the earlier, smaller suite.
- [`classification-results.csv`](./classification-results.csv): latest expanded
  multi-field suite.
