<template>
  <div>
    <h2>Pre-Deployment Testing Status</h2>
    <details>
      <summary class="success">UI Unit Tests</summary>
      <ul>
        <li>
          <div class="success">
            Test 1
            <details>
              <summary class="success">UI Unit Tests</summary>
              <div> foo </div>
              <ul>
                <li>
                  <div class="success">
                    Test 1
                    <span class="status">succeeded</span>
                  </div>
                </li>
                <li>
                  <div class="success">
                    Test 2<span class="status">succeeded</span>
                  </div>
                </li>
              </ul>
            </details>
          </div>
        </li>
        <li>
          <div class="success">Test 2<span class="status">succeeded</span></div>
        </li>
      </ul>
    </details>
    <details>
      <summary class="warning">API Unit Tests</summary>
      <ul>
        <li>
          <div class="success">Test 1<span class="status">succeeded</span></div>
        </li>
        <li>
          <div class="warning">
            Test 2<span class="status">warning</span
            ><span class="info"
              >info here about the warning status. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Cras imperdiet eros eu nisl maximus
              auctor. Aenean tempus ornare urna ultricies lacinia. Duis laoreet
              pharetra lectus eu maximus. Fusce ut ante convallis, placerat
              risus in, molestie diam. Nam vitae mollis massa, nec commodo
              purus</span
            >
          </div>
        </li>
        <li>
          <div class="success">Test 3<span class="status">succeeded</span></div>
        </li>
      </ul>
    </details>
    <details open="open">
      <summary class="failure">DB Unit Tests</summary>
      <ul>
        <li>
          <div class="success">Test 1<span class="status">succeeded</span></div>
        </li>
        <li>
          <div class="success">Test 2<span class="status">succeeded</span></div>
        </li>
        <li>
          <div class="failure">
            Test 3<span class="status">failure</span
            ><span class="info"
              >info here about the failure status. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Cras imperdiet eros eu nisl maximus
              auctor. Aenean tempus ornare urna ultricies lacinia. Duis laoreet
              pharetra lectus eu maximus. Fusce ut ante convallis, placerat
              risus in, molestie diam. Nam vitae mollis massa, nec commodo
              purus</span
            >
          </div>
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
export default {
  name: "Details",
};
</script>

<style lang="sass">

@mixin statuses()
  &.success:before
    color: #9cc320
    content: "\f058"

  &.warning:before
    color: #ffa50a
    content: "\f06a"

  &.failure:before
    color: #da281e
    content: "\f057"

details
  width: 100%
  overflow: hidden
  border-bottom: 1px solid rgba(black, 0.1)

  &:last-of-type
    border-bottom: none

  summary
    display: block
    user-select: none
    outline: none
    padding: 20px
    margin-bottom: 0px
    transition: all 600ms cubic-bezier(0.23, 1, 0.32, 1)
    transition-property: margin, background
    font-weight: 600
    border-bottom: 1px solid rgba(black, 0.1)

    &:last-of-type
      border-bottom: none

    &::-webkit-details-marker
      display: none

    &:before
      font-weight: 900
      content: ''
      margin-right: 0.5em


    &:hover
      background: #f6f8fb
      cursor: pointer

    @include statuses()

  ul
    padding: 0
    margin-left: 1em

  li
    list-style: none
    padding: 1em 1em 1em 3em
    font-weight: bold
    position: relative

    &:before
      position: absolute
      top: 0
      left: 0
      display: block
      float: left
      content: ''
      width: 0em
      height: 1.5em
      border-left: 1px solid #ccc
      border-bottom: 1px solid #ccc

    &:after
      position: absolute
      top: 0
      left: 0
      display: block
      float: left
      content: ''
      width: 1em
      height: 100%
      border-left: 1px solid #ccc

    &:last-child:after
      display: none

    div
      opacity: 0

      &:before
        font-weight: 900
        position: absolute
        top: 1em
        left: 1em
        padding: 0 0.5em
        display: block
        float: left
        content: ""
        width: 1em
        height: 100%

      @include statuses()

    span
      display: block
      font-size: 0.9em
      font-weight: normal

      &:before
        opacity: 0.3
        font-weight: bold

      &.status:before
        content: 'status: '

      &.info:before
        content: 'info: '

  &[open]
    summary
      margin-bottom: 20px
      padding-bottom: 20px
      border-bottom: 1px solid rgba(black, 0.1)

    summary
      & ~ ul
        li
          > div, div:before
	          animation: sweep .5s ease-in-out normal forwards
	          animation-delay: .1s

    summary
	    & ~ ul
		    li
		      &:before
	          animation: grow .5s ease-in-out normal forwards
	          animation-delay: .1s

    @keyframes sweep
      0%
        opacity: 0
        margin-left: -1em
        margin-right: 1em
      100%
        opacity: 1
        margin-left: 0
        margin-right: 0


    @keyframes grow
      0%
        width: 0
      100%
        width: 1em
</style>
