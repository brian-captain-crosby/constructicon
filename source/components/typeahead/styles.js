export default (props, traits) => {
  const {
    colors,
    measures,
    scale,
    rhythm,
    transitions
  } = traits

  const { selected } = props

  return {
    root: {
      width: '100%',
      position: 'relative',
      textAlign: 'left',
      margin: '0 auto'
    },

    field: {
      position: 'relative',
      '> input': {
        opacity: selected && 0,
        visibility: selected && 'hidden'
      }
    },

    input: {
      width: '100%',
      padding: `${rhythm(0.333)} ${rhythm(0.5)}`,
      paddingRight: rhythm(1.667),
      borderWidth: 1,
      borderStyle: 'solid',
      textAlign: 'left',
      borderRadius: '0.125rem'
    },

    icon: {
      position: 'absolute',
      right: rhythm(0.5),
      top: '50%',
      height: rhythm(1),
      marginTop: rhythm(-0.5),
      pointerEvents: 'none',
      zIndex: 2
    },

    selected: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      '> input': {
        cursor: 'pointer'
      },
      ':hover': {
        opacity: 0.8
      }
    },

    matches: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      transform: `translateY(${rhythm(0.25)})`,
      backgroundColor: colors.light,
      color: colors.dark,
      borderRadius: rhythm(0.125),
      boxShadow: '0 2px 5px rgba(0,0,0,0.125)',
      overflow: 'auto',
      maxHeight: rhythm(10)
    },

    result: {
      display: 'block',
      padding: rhythm(0.333),
      borderBottom: `1px solid ${colors.lightGrey}`,
      textAlign: 'left',
      transition: transitions.easeOut,
      ':hover': {
        backgroundColor: colors.secondary,
        color: colors.light
      },
      ':last-child': {
        borderBottomWidth: 0
      },
      em: {
        color: colors.primary
      }
    },

    highlighted: {
      backgroundColor: colors.secondary,
      color: colors.light
    },

    noMatch: {
      padding: rhythm(0.5),
      textAlign: 'center'
    },

    noMatchIntro: {
      fontSize: scale(-0.75),
      lineHeight: measures.medium,
      a: {
        color: colors.tertiary
      },
      p: {
        paddingBottom: rhythm(0.25),
        ':last-child': {
          paddingBottom: 0
        }
      }
    },

    donateButton: {
      marginTop: rhythm(0.5)
    }
  }
}
