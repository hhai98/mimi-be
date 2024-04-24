import { Question } from 'src/modules/questions/entities/question.entity'
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class ShortAnswerQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Question, (question) => question.shortAnswerQuestion, { onDelete: 'CASCADE' })
  question: Question

  @Column('simple-array')
  correctAnswers: string[]
}
