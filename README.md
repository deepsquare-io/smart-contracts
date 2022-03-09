# DeepSquare blockchain

[![License](https://img.shields.io/static/v1?label=license&message=MIT&color=blue&style=flat-square)](https://github.com/deepsquare-io/blockchain/blob/main/LICENSE.md)
[![Whitepaper](https://img.shields.io/static/v1?label=download&message=whitepaper&color=cd45FF&style=flat-square)](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf)
[![Codecov](https://img.shields.io/codecov/c/gh/deepsquare-io/blockchain?style=flat-square&token=7GE7USOW1S)](https://app.codecov.io/gh/deepsquare-io/blockchain)

DeepSquare smart contracts running on the [Avalanche C-chain](https://www.avax.network). The contracts are mainly based
on the OpenZeppelin smart contracts ([@openzeppelin/contracts v4](https://docs.openzeppelin.com/contracts/4.x/)) which
are considered as a security standard.

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
The DPS token has currently restricted transfer options, as described in the [DeepSquare whitepaper](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf).

## Sale process

The [Sale.sol](contracts/Sale.sol) contract allows to conduct the DPS private sale.

![Sale process diagram](https://mermaid.ink/img/pako:eNqtVE1v2zAM_SuETxuajzbrDvOh2JAWWzZgG5phw4BcZImJhciSK1EpgqL_vZTlfKzpDgNmGJYgPz6-R9J-KKRTWJRFwLuIVuK1FisvmoUFvlrhSUvdCkswAxFgZjcYyPnT13NhMCG6VTpLXkg6hX3jY4MvhKOMXtO2o9jtDzQ5wGi77hKU3XMUnAFn4aOmT7GC91ATtaEcj1ea6liNpGvGCrENd1F4HGo3royTa1kLbdO2Gjdpt8sSxjvS42y9lnK_-_9Zj4iT05zdoyTwq-rVZHI-gMnbCT_eXLzOL9M1G15dneVylnCbuhcItEJLqXQbYbQSpJ09RHx1hOA26GE22AV--T0FHYAVeI40W6iFVQYVVFv4HBvtYOp863xHNTpw5XiWMDxU6BcvGIBq7Gg9hmj6EUCrTo1dvEueLpO7y2fGcpM_GOPugVweKl65YjYs2UDNmgOJyqB0-i8WM8ePBOV7bd29TdO1KDpawbO-KEDbTu_N7XQ4OU-UVgmvRn-o_gfdZ71wImxaCklzFbdw_X1-wCVIB90XblqjXINespr8eXEXwq6F3IvOQt_ZI54-fth1QeQxoOhtbkEMXIXUB9LoX6pQDvnZZ8lBAY15pjSxz9L4W5UxezN8UgyKBj0PtOJfyEM6XhSMabi0JW8VLkWagWJhHxka25TpRmm2WJRLYQIOChHJzbdWFiX5iDtQ_xvqUY9PPoWHCQ)

## References

- [DeepSquare whitepaper](https://github.com/deepsquare-io/Whitepaper/releases/latest/download/DeepSquare-WhitePaper.pdf)
- [Avalanche whitepapers](https://www.avalabs.org/whitepapers)
