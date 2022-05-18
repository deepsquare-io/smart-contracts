# DeepSquare smart-contracts

[![License](https://img.shields.io/static/v1?label=license&message=MIT&color=blue&style=flat-square)](https://github.com/deepsquare-io/smart-contracts/blob/main/LICENSE.md)
[![Whitepaper](https://img.shields.io/static/v1?label=download&message=whitepaper&color=cd45FF&style=flat-square)](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf)
[![Codecov](https://img.shields.io/codecov/c/gh/deepsquare-io/smart-contracts?style=flat-square&token=7GE7USOW1S)](https://app.codecov.io/gh/deepsquare-io/smart-contracts)

DeepSquare smart contracts running on the [Avalanche C-chain](https://www.avax.network). The contracts are mainly based
on the OpenZeppelin smart contracts ([@openzeppelin/contracts v4](https://docs.openzeppelin.com/contracts/4.x/)) which
are considered as a security standard.

## Deployed smart contracts

| Contract                                         | Address                                                                                                                    |
|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| [DeepSquare](./contracts/DeepSquare.sol) (ERC20) | [0xf192caE2e7Cd4048Bea307368015E3647c49338e](https://snowtrace.io/token/0xf192caE2e7Cd4048Bea307368015E3647c49338e)        |
| [Eligibility](./contracts/Eligibility.sol)       | [0x52088e60AfB56E83cA0B6340B49F709e57973869](https://snowtrace.io/address/0x52088e60AfB56E83cA0B6340B49F709e57973869#code) |
| [Sale](./contracts/Sale.sol)                     | [0x8c94e12C2d05b2060DF9D9732980bca363F3F58a](https://snowtrace.io/address/0x8c94e12C2d05b2060DF9D9732980bca363F3F58a#code) |

## Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mathieu-bour">
        <img src="https://avatars.githubusercontent.com/u/21281702?v=3?s=150" width="150px;" alt=""/>
        <br />
        <b>Mathieu Bour</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ArcticSubmarine">
        <img src="https://avatars.githubusercontent.com/u/48919999?v=3?s=150" width="150px;" alt=""/>
        <br />
        <b>Mathieu Bour</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/derschnee68">
        <img src="https://avatars.githubusercontent.com/u/12176105?v=3?s=150" width="150px;" alt=""/>
        <br />
        <b>Julien Schneider</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Lymnah">
        <img src="https://avatars.githubusercontent.com/u/29931035?v=3?s=150" width="150px;" alt=""/>
        <br />
        <b>Charly Mancel</b>
      </a>
    </td>
  </tr>
</table>

## ERC-20 tokens

### DPS security token

The [DeepSquare.sol](contracts/DeepSquare.sol) contract represents ERC-20-compatible DPS token.
The DPS token has currently restricted transfer options, as described in
the [DeepSquare whitepaper][DeepSquare whitepaper]

### SQR utility token

The [Square.sol](contracts/Square.sol) contract represents ERC-20-compatible SQR token. The SQR is meant to be used as a
utility token (e.g. tradable on exchanges, etc.).

### Bridge

The [Bridge.sol](contracts/Bridge.sol) contract allow the investors to swap DPS to SQR and vice-versa.

## Token sale

### DPS private sale

The [Sale.sol](contracts/Sale.sol) contract allows to conduct the DPS private sale.

![Sale process diagram](https://mermaid.ink/img/pako:eNqtVE1v2zAM_SuETxuajzbrDvOh2JAWWzZgG5phw4BcZImJhciSK1EpgqL_vZTlfKzpDgNmGJYgPz6-R9J-KKRTWJRFwLuIVuK1FisvmoUFvlrhSUvdCkswAxFgZjcYyPnT13NhMCG6VTpLXkg6hX3jY4MvhKOMXtO2o9jtDzQ5wGi77hKU3XMUnAFn4aOmT7GC91ATtaEcj1ea6liNpGvGCrENd1F4HGo3royTa1kLbdO2Gjdpt8sSxjvS42y9lnK_-_9Zj4iT05zdoyTwq-rVZHI-gMnbCT_eXLzOL9M1G15dneVylnCbuhcItEJLqXQbYbQSpJ09RHx1hOA26GE22AV--T0FHYAVeI40W6iFVQYVVFv4HBvtYOp863xHNTpw5XiWMDxU6BcvGIBq7Gg9hmj6EUCrTo1dvEueLpO7y2fGcpM_GOPugVweKl65YjYs2UDNmgOJyqB0-i8WM8ePBOV7bd29TdO1KDpawbO-KEDbTu_N7XQ4OU-UVgmvRn-o_gfdZ71wImxaCklzFbdw_X1-wCVIB90XblqjXINespr8eXEXwq6F3IvOQt_ZI54-fth1QeQxoOhtbkEMXIXUB9LoX6pQDvnZZ8lBAY15pjSxz9L4W5UxezN8UgyKBj0PtOJfyEM6XhSMabi0JW8VLkWagWJhHxka25TpRmm2WJRLYQIOChHJzbdWFiX5iDtQ_xvqUY9PPoWHCQ)

### SQR public sale

TBD

## Vesting schedule

The DPS vesting schedule is controlled by restricting the DPS transfers to the Bridge.
This is equivalent to force the account to keep a minimum DPS balance.

## References

- [DeepSquare whitepaper][DeepSquare whitepaper]
- [Avalanche whitepapers](https://www.avalabs.org/whitepapers)

[DeepSquare whitepaper]: https://deepsquare.gitbook.io/white-paper/nbKUltb7gLjwAhl9vMcw/
