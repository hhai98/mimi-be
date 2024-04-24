import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, JoinColumn, OneToOne } from 'typeorm'
import { TYPES_ENUM } from 'src/modules/questions/enums/types.enum'
import { ChoiceQuestion } from 'src/modules/questions/entities/choice-questions.entity'
import { ShortAnswerQuestion } from 'src/modules/questions/entities/short-answer-question.entity'
import { TrueFalseQuestion } from 'src/modules/questions/entities/true-false-questions.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Question extends CoreEntity {
  @Column()
  question: string

  @Column({ type: 'enum', enum: TYPES_ENUM })
  type: TYPES_ENUM

  @OneToOne(() => ChoiceQuestion, { nullable: true, eager: true })
  @JoinColumn()
  choiceQuestion: ChoiceQuestion

  @OneToOne(() => TrueFalseQuestion, { nullable: true, eager: true })
  @JoinColumn()
  trueFalseQuestion: TrueFalseQuestion

  @OneToOne(() => ShortAnswerQuestion, { nullable: true, eager: true })
  @JoinColumn()
  shortAnswerQuestion: ShortAnswerQuestion

  @Column({ nullable: true })
  answerExplain: string
}
